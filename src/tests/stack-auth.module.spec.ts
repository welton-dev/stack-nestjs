import { Test } from '@nestjs/testing';
import { StackAuthModule } from '../stack-auth.module';
import { ApiClientService } from '../services/api-client.service';
import { STACK_AUTH_OPTIONS, STACK_AUTH_LOGGER } from '../provider.declarations';
import { StackAuthConfigRef } from '../models/stack-auth.config-ref';
import { Logger } from '@nestjs/common';
import { StackAuthOptions, StackAuthOptionsFactory } from '../interfaces/stack-auth-options';
import { StackAuthAccessTypes } from '../interfaces/stack-auth-config.interface';
import { createMock } from '@golevelup/ts-jest';
import { Injectable } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Global } from '@nestjs/common';

describe('StackAuthModule', () => {
	const mockOptionsClient: StackAuthOptions = {
		baseURL: 'http://test.com',
		global: true,
		stackAuth: {
			projectId: 'test-project',
			accessType: StackAuthAccessTypes.CLIENT,
			publishableClientKey: 'pk_test_123',
		},
	};

	const mockOptionsServer: StackAuthOptions = {
		baseURL: 'http://test.com',
		global: true,
		stackAuth: {
			projectId: 'test-project',
			accessType: StackAuthAccessTypes.SERVER,
			secretServerKey: 'sk_test_123',
		},
	};

	describe('register', () => {
		it('should register module with sync options', async () => {
			const module = await Test.createTestingModule({
				imports: [StackAuthModule.register(mockOptionsClient)],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual(mockOptionsClient);
			expect(module.get(STACK_AUTH_LOGGER)).toBeInstanceOf(Logger);
			expect(module.get(StackAuthConfigRef)).toBeDefined();
		});

		it('should register module with custom logger', async () => {
			const customLogger = createMock<Logger>();
			const optionsWithLogger = { ...mockOptionsClient, logger: customLogger };

			const module = await Test.createTestingModule({
				imports: [StackAuthModule.register(optionsWithLogger)],
			}).compile();

			expect(module.get(STACK_AUTH_LOGGER)).toBe(customLogger);
		});

		it('should register module as global', async () => {
			const module = await Test.createTestingModule({
				imports: [StackAuthModule.register({ ...mockOptionsClient, global: true })],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual({ ...mockOptionsClient, global: true });
		});

		it('should register module as global by default', async () => {
			const module = await Test.createTestingModule({
				imports: [StackAuthModule.register({ ...mockOptionsClient, global: undefined })],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual({ ...mockOptionsClient, global: undefined });
		});

		it('should register module as non-global', async () => {
			const module = await Test.createTestingModule({
				imports: [StackAuthModule.register({ ...mockOptionsClient, global: false })],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual({ ...mockOptionsClient, global: false });
		});
	});

	describe('registerAsync', () => {
		it('should register module with useFactory', async () => {
			const module = await Test.createTestingModule({
				imports: [
					StackAuthModule.registerAsync({
						useFactory: () => mockOptionsClient,
					}),
				],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual(mockOptionsClient);
		});

		it('should register module with useClass', async () => {
			class TestOptionsFactory implements StackAuthOptionsFactory {
				createStackAuthOptions(): Promise<StackAuthOptions> {
					return Promise.resolve(mockOptionsClient);
				}
			}

			const module = await Test.createTestingModule({
				imports: [
					StackAuthModule.registerAsync({
						useClass: TestOptionsFactory,
					}),
				],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual(mockOptionsClient);
		});

		it('should register module with useExisting', async () => {
			@Injectable()
			class TestOptionsFactory implements StackAuthOptionsFactory {
				createStackAuthOptions(): Promise<StackAuthOptions> {
					return Promise.resolve(mockOptionsClient);
				}
			}

			@Global()
			@Module({
				providers: [TestOptionsFactory],
				exports: [TestOptionsFactory],
			})
			class TestModule {}

			const module = await Test.createTestingModule({
				imports: [
					TestModule,
					StackAuthModule.registerAsync({
						imports: [TestModule],
						useExisting: TestOptionsFactory,
					}),
				],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual(mockOptionsClient);
		});

		it('should register async module as global', async () => {
			const module = await Test.createTestingModule({
				imports: [
					StackAuthModule.registerAsync({
						useFactory: () => ({ ...mockOptionsClient, global: true }),
					}),
				],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual({ ...mockOptionsClient, global: true });
		});

		it('should register async module as global by default', async () => {
			const module = await Test.createTestingModule({
				imports: [
					StackAuthModule.registerAsync({
						useFactory: () => ({ ...mockOptionsClient, global: undefined }),
					}),
				],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual({ ...mockOptionsClient, global: undefined });
		});

		it('should register async module as non-global', async () => {
			const module = await Test.createTestingModule({
				imports: [
					StackAuthModule.registerAsync({
						useFactory: () => ({ ...mockOptionsClient, global: false }),
					}),
				],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual({ ...mockOptionsClient, global: false });
		});

		it('should register async module with global option from module options', async () => {
			const module = await Test.createTestingModule({
				imports: [
					StackAuthModule.registerAsync({
						global: false,
						useFactory: () => mockOptionsClient,
					}),
				],
			}).compile();

			expect(module.get(ApiClientService)).toBeDefined();
			expect(module.get(STACK_AUTH_OPTIONS)).toEqual(mockOptionsClient);
		});

		it('should throw error if no options factory method provided', async () => {
			await expect(
				Test.createTestingModule({
					imports: [StackAuthModule.registerAsync({} as any)],
				}).compile(),
			).rejects.toThrow();
		});
	});

	describe('validateOptions', () => {
		it('should throw error if projectId is missing', async () => {
			await expect(
				Test.createTestingModule({
					imports: [
						StackAuthModule.registerAsync({
							useFactory: () => ({
								baseURL: 'http://test.com',
								stackAuth: {
									accessType: StackAuthAccessTypes.CLIENT,
									publishableClientKey: 'pk_test_123',
								} as any,
							}),
						}),
					],
				}).compile(),
			).rejects.toThrow('Stack auth options must be contains "projectId".');
		});

		it('should throw error if baseURL is missing', async () => {
			await expect(
				Test.createTestingModule({
					imports: [
						StackAuthModule.registerAsync({
							useFactory: () =>
								({
									stackAuth: {
										projectId: 'test-project',
										accessType: StackAuthAccessTypes.CLIENT,
										publishableClientKey: 'pk_test_123',
									},
								}) as any,
						}),
					],
				}).compile(),
			).rejects.toThrow('Stack auth options must be contains "baseURL".');
		});

		it('should throw error if client tries to use secretServerKey', async () => {
			await expect(
				Test.createTestingModule({
					imports: [
						StackAuthModule.registerAsync({
							useFactory: () => ({
								baseURL: 'http://test.com',
								stackAuth: {
									projectId: 'test-project',
									accessType: StackAuthAccessTypes.CLIENT,
									secretServerKey: 'sk_test_123',
								},
							}),
						}),
					],
				}).compile(),
			).rejects.toThrow('Stack auth options client use "publishableClientKey" instead "secretServerKey".');
		});

		it('should throw error if server tries to use publishableClientKey', async () => {
			await expect(
				Test.createTestingModule({
					imports: [
						StackAuthModule.registerAsync({
							useFactory: () => ({
								baseURL: 'http://test.com',
								stackAuth: {
									projectId: 'test-project',
									accessType: StackAuthAccessTypes.SERVER,
									publishableClientKey: 'pk_test_123',
								},
							}),
						}),
					],
				}).compile(),
			).rejects.toThrow('Stack auth options server use "secretServerKey" instead "publishableClientKey".');
		});

		it('should throw error if neither secretServerKey nor publishableClientKey is provided', async () => {
			await expect(
				Test.createTestingModule({
					imports: [
						StackAuthModule.registerAsync({
							useFactory: () => ({
								baseURL: 'http://test.com',
								stackAuth: {
									projectId: 'test-project',
									accessType: StackAuthAccessTypes.CLIENT,
								},
							}),
						}),
					],
				}).compile(),
			).rejects.toThrow('Stack auth options must be contains "secretServerKey" or "publishableClientKey".');
		});

		it('should throw error if both secretServerKey and publishableClientKey are provided', async () => {
			await expect(
				Test.createTestingModule({
					imports: [
						StackAuthModule.registerAsync({
							useFactory: () => ({
								baseURL: 'http://test.com',
								stackAuth: {
									projectId: 'test-project',
									accessType: StackAuthAccessTypes.SERVER,
									publishableClientKey: 'pk_test_123',
									secretServerKey: 'sk_test_123',
								},
							}),
						}),
					],
				}).compile(),
			).rejects.toThrow('Stack auth options server use "secretServerKey" instead "publishableClientKey".');
		});
	});

	describe('createHeaders', () => {
		it('should create correct headers for client mode', async () => {
			const module = await Test.createTestingModule({
				imports: [StackAuthModule.register(mockOptionsClient)],
			}).compile();

			const apiClient = module.get(ApiClientService);
			expect(apiClient).toBeDefined();

			// Verifica se o ApiClientService foi configurado com as opções corretas
			const headers = (apiClient as any).httpService.axiosRef.defaults.headers;
			expect(headers['X-Stack-Access-Type']).toBe(StackAuthAccessTypes.CLIENT);
			expect(headers['X-Stack-Project-Id']).toBe('test-project');
			expect(headers['X-Stack-Publishable-Client-Key']).toBe('pk_test_123');
			expect(headers['X-Stack-Secret-Server-Key']).toBeUndefined();
		});

		it('should create correct headers for server mode', async () => {
			const module = await Test.createTestingModule({
				imports: [StackAuthModule.register(mockOptionsServer)],
			}).compile();

			const apiClient = module.get(ApiClientService);
			expect(apiClient).toBeDefined();

			// Verifica se o ApiClientService foi configurado com as opções corretas
			const headers = (apiClient as any).httpService.axiosRef.defaults.headers;
			expect(headers['X-Stack-Access-Type']).toBe(StackAuthAccessTypes.SERVER);
			expect(headers['X-Stack-Project-Id']).toBe('test-project');
			expect(headers['X-Stack-Secret-Server-Key']).toBe('sk_test_123');
			expect(headers['X-Stack-Publishable-Client-Key']).toBeUndefined();
		});
	});
});
