import { type DynamicModule, Logger, type Provider, type Type } from '@nestjs/common';
import { ApiClientService } from './services/api-client.service';
import { HttpModule } from '@nestjs/axios';
import { StackAuthHeaders } from './interfaces/stack-auth-config.interface';
import { type StackAuthOptions, type StackAuthModuleAsyncOptions, type StackAuthOptionsFactory } from './interfaces/stack-auth-options';
import { xor } from './helpers/xor';
import { STACK_AUTH_LOGGER, STACK_AUTH_OPTIONS } from './provider.declarations';
import { StackAuthConfigRef } from './models/stack-auth.config-ref';
import { ServiceDiscoveryHelper } from './helpers/service-discovery';
import { rootServices } from './repositories/root.services';

export class StackAuthModule {
	private static readonly logger = new Logger('StackAuthModule');
	private static readonly services = [...rootServices];

	static register(options: StackAuthOptions): DynamicModule {
		this.logger.log('Registering StackAuthModule');
		const providers: Provider[] = [
			ApiClientService,
			{
				provide: STACK_AUTH_OPTIONS,
				useValue: options,
			},
			{
				provide: STACK_AUTH_LOGGER,
				useValue: options.logger || new Logger('StackAuthModule'),
			},
			{
				provide: StackAuthConfigRef,
				useFactory: () => new StackAuthConfigRef(options),
			},
			...ServiceDiscoveryHelper.discoverServices(this.services),
		];

		const httpModule = HttpModule.register({
			...options,
			baseURL: options.baseURL + '/api/v1',
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
			exports: [ApiClientService, STACK_AUTH_OPTIONS, STACK_AUTH_LOGGER, ...ServiceDiscoveryHelper.getServiceTokens(this.services)],
			global: options.global != null ? options.global : true,
		};
	}

	static registerAsync(options: StackAuthModuleAsyncOptions): DynamicModule {
		const providers: Provider[] = [
			ApiClientService,
			{
				provide: STACK_AUTH_LOGGER,
				useFactory: async (opts: StackAuthOptions) => opts.logger || new Logger('StackAuthModule'),
				inject: [STACK_AUTH_OPTIONS],
			},
			{
				provide: StackAuthConfigRef,
				useFactory: async (opts: StackAuthOptions) => new StackAuthConfigRef(opts),
				inject: [STACK_AUTH_OPTIONS],
			},
			...ServiceDiscoveryHelper.discoverServices(this.services),
			...this.createAsyncProviders(options),
		];

		const httpModule = HttpModule.registerAsync({
			inject: [...(options.inject || [])],
			useFactory: async (...args) => {
				const config = await this.createApiClientOptions(options, ...args);

				this.validateOptions(config);

				// Ensure that the baseURL does not end with /
				config.baseURL = config.baseURL?.replace(/\/+$/, '');

				const httpConfig = {
					...config,
					timeout: config.timeout || 5000,
					baseURL: `${config.baseURL}/api/v1`,
					headers: {
						...config.headers,
						...StackAuthModule.createHeaders(config),
					},
				};
				return httpConfig;
			},
		});

		return {
			module: StackAuthModule,
			imports: [httpModule],
			providers,
			exports: [ApiClientService, STACK_AUTH_OPTIONS, STACK_AUTH_LOGGER, ...ServiceDiscoveryHelper.getServiceTokens(this.services)],
			global: options.global != null ? options.global : true,
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
			useFactory: async (optionsFactory: StackAuthOptionsFactory): Promise<StackAuthOptions> => {
				if (!this.isStackAuthFactory(optionsFactory)) {
					throw new Error("Factory must be implement 'StackAuthOptionsFactory' interface.");
				}
				return optionsFactory.createStackAuthOptions();
			},
			inject: [options.useExisting || options.useClass] as Type<StackAuthOptionsFactory>[],
		};
	}

	private static async createApiClientOptions(options: StackAuthModuleAsyncOptions, ...args: unknown[]): Promise<StackAuthOptions> {
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

	private static validateOptions(options: StackAuthOptions): void | never {
		if (!options.stackAuth.projectId) {
			throw new Error('Stack auth options must be contains "projectId".');
		}

		if (!options.baseURL) {
			throw new Error('Stack auth options must be contains "baseURL".');
		}

		if (options.stackAuth.accessType === 'client' && options.stackAuth.secretServerKey) {
			throw new Error('Stack auth options client use "publishableClientKey" instead "secretServerKey".');
		}

		if (options.stackAuth.accessType === 'server' && options.stackAuth.publishableClientKey) {
			throw new Error('Stack auth options server use "secretServerKey" instead "publishableClientKey".');
		}

		if (!xor(!options.stackAuth.publishableClientKey, !options.stackAuth.secretServerKey)) {
			throw new Error('Stack auth options must be contains "secretServerKey" or "publishableClientKey".');
		}
	}

	private static createHeaders(options: StackAuthOptions): StackAuthHeaders {
		const headers: StackAuthHeaders = {
			'X-Stack-Access-Type': options.stackAuth.accessType,
			'X-Stack-Project-Id': options.stackAuth.projectId,
		};

		if (options.stackAuth.accessType === 'client') {
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
