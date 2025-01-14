import { DynamicModule, Logger, Provider, Type } from '@nestjs/common';
import { ApiClientService } from './client';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from './repositories/user.repository';
import { StackAuthHeaders } from './interfaces/stack-auth-config.interface';
import { StackAuthModuleOptions, StackAuthModuleAsyncOptions, StackAuthOptionsFactory } from './interfaces/stackauth-module-option';
import { xor } from './helpers/xor';
import { STACK_AUTH_LOGGER, STACK_AUTH_OPTIONS } from './provider.declarations';
import { StackAuthConfigRef } from './models/stack-auth.config-ref';
import { StackAuthRequestResolver } from './services/request.resolver';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

export class StackAuthModule {
	private static readonly logger = new Logger('StackAuthModule');

	static register(options: StackAuthModuleOptions): DynamicModule {
		const providers: Provider[] = [
			ApiClientService,
			UserRepository,
			StackAuthRequestResolver,
			{
				provide: STACK_AUTH_OPTIONS,
				useValue: options,
			},
			{
				provide: STACK_AUTH_LOGGER,
				useValue: options.logger || new Logger(),
			},
			{
				provide: StackAuthConfigRef,
				useFactory: () => new StackAuthConfigRef(options),
			},
		];

		const httpModule = HttpModule.register({
			baseURL: options.stackAuth.baseURL + '/api/v1',
			timeout: options.timeout || 5000,
			headers: {
				...(options.headers || {}),
				...StackAuthModule.createHeaders(options),
			},
		});

		return {
			module: StackAuthModule,
			imports: [httpModule],
			providers,
			exports: [ApiClientService, UserRepository, STACK_AUTH_OPTIONS],
			global: options.global,
		};
	}

	static registerAsync(options: StackAuthModuleAsyncOptions): DynamicModule {
		const providers: Provider[] = [
			ApiClientService,
			UserRepository,
			StackAuthRequestResolver,
			{
				provide: STACK_AUTH_LOGGER,
				useFactory: async (opts: StackAuthModuleOptions) => opts.logger || new Logger(),
				inject: [STACK_AUTH_OPTIONS],
			},
			{
				provide: StackAuthConfigRef,
				useFactory: async (opts: StackAuthModuleOptions) => new StackAuthConfigRef(opts),
				inject: [STACK_AUTH_OPTIONS],
			},
			...this.createAsyncProviders(options),
		];

		const httpModule = HttpModule.registerAsync({
			imports: [ConfigModule],
			inject: [StackAuthRequestResolver, ConfigService],
			useFactory: async (requestResolver: StackAuthRequestResolver, configService: ConfigService) => {
				const config = await this.createApiClientOptions(options, configService);

				const accessToken = requestResolver.getAccessToken();

				this.validateOptions(config);

				// Garantir que a baseURL não termine com /
				config.stackAuth.baseURL = config.stackAuth.baseURL.replace(/\/+$/, '');

				const httpConfig = {
					timeout: config.timeout || 5000,
					baseURL: `${config.stackAuth.baseURL}/api/v1`,
					headers: {
						...config.headers,
						...StackAuthModule.createHeaders(config),
						'X-Stack-Access-Token': accessToken,
					},
				};
				return httpConfig;
			},
		});

		return {
			module: StackAuthModule,
			imports: [...(options.imports || []), httpModule],
			providers,
			exports: [ApiClientService, UserRepository, STACK_AUTH_OPTIONS, StackAuthRequestResolver],
			global: options.global,
		};
	}

	private static createAsyncProviders(options: StackAuthModuleAsyncOptions): Provider[] {
		const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

		if (options.useClass) {
			providers.push({
				provide: options.useClass,
				useClass: options.useClass,
			});
		}

		return providers;
	}

	private static createAsyncOptionsProvider(options: StackAuthModuleAsyncOptions): Provider {
		if (options.useFactory) {
			return {
				provide: STACK_AUTH_OPTIONS,
				useFactory: options.useFactory,
				inject: options.inject,
			};
		}

		return {
			provide: STACK_AUTH_OPTIONS,
			useFactory: async (optionsFactory: StackAuthOptionsFactory): Promise<StackAuthModuleOptions> => {
				if (!this.isStackAuthFactory(optionsFactory)) {
					throw new Error("Factory must be implement 'StackAuthOptionsFactory' interface.");
				}
				return optionsFactory.createStackAuthOptions();
			},
			inject: [options.useExisting || options.useClass] as Type<StackAuthOptionsFactory>[],
		};
	}

	private static async createApiClientOptions(options: StackAuthModuleAsyncOptions, ...args: unknown[]): Promise<StackAuthModuleOptions> {
		if (options.useFactory) {
			const result = await options.useFactory(...args);
			return result;
		}
		const optionsFactory = await this.createOptionsFactory(options);
		return optionsFactory.createStackAuthOptions();
	}

	private static async createOptionsFactory(options: StackAuthModuleAsyncOptions): Promise<StackAuthOptionsFactory> {
		if (options.useExisting || options.useClass) {
			const FactoryClass = options.useClass ?? options.useExisting;
			if (!FactoryClass) {
				throw new Error('FactoryClass cannot be undefined');
			}
			return new FactoryClass();
		}
		throw new Error('Invalid configuration. Must provide useFactory, useClass or useExisting');
	}

	private static validateOptions(options: StackAuthModuleOptions): void | never {
		if (!options.stackAuth.projectId) {
			throw new Error('Stack auth options must be contains "projectId".');
		}

		if (!options.stackAuth.baseURL) {
			throw new Error('Stack auth options must be contains "baseURL".');
		}

		if (options.accessType === 'client' && options.stackAuth.secretServerKey) {
			throw new Error('Stack auth options client use "publishableClientKey" instead "secretServerKey".');
		}

		if (options.accessType === 'server' && options.stackAuth.publishableClientKey) {
			throw new Error('Stack auth options server use "secretServerKey" instead "publishableClientKey".');
		}

		if (!xor(!options.stackAuth.publishableClientKey, !options.stackAuth.secretServerKey)) {
			throw new Error('Stack auth options must be contains "secretServerKey" or "publishableClientKey".');
		}
	}

	private static createHeaders(options: StackAuthModuleOptions): StackAuthHeaders {
		const headers: StackAuthHeaders = {
			'X-Stack-Access-Type': options.accessType,
			'X-Stack-Project-Id': options.stackAuth.projectId,
		};

		if (options.accessType === 'client') {
			headers['X-Stack-Publishable-Client-Key'] = options.stackAuth.publishableClientKey;
		} else {
			headers['X-Stack-Secret-Server-Key'] = options.stackAuth.secretServerKey;
		}

		return headers;
	}

	private static isStackAuthFactory(object: StackAuthOptionsFactory): object is StackAuthOptionsFactory {
		return !!object && typeof object.createStackAuthOptions === 'function';
	}
}
