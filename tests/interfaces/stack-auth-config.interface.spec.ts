import { StackAuthAccessTypes, StackAuthConfig, StackAuthHeaders } from '../../src/interfaces/stack-auth-config.interface';
import { StackAuthOptions, StackAuthOptionsFactory, LogLevel } from '../../src/interfaces/stack-auth-options';

describe('Stack Auth Configuration Interfaces', () => {
	describe('StackAuthConfig', () => {
		it('should validate client configuration', () => {
			const config: StackAuthConfig = {
				projectId: 'test-project',
				accessType: StackAuthAccessTypes.CLIENT,
				publishableClientKey: 'pk_test_123',
			};

			expect(config.accessType).toBe(StackAuthAccessTypes.CLIENT);
			expect(config.projectId).toBeDefined();
			expect(config.publishableClientKey).toBeDefined();
		});

		it('should validate server configuration', () => {
			const config: StackAuthConfig = {
				projectId: 'test-project',
				accessType: StackAuthAccessTypes.SERVER,
				secretServerKey: 'sk_test_123',
			};

			expect(config.accessType).toBe(StackAuthAccessTypes.SERVER);
			expect(config.projectId).toBeDefined();
			expect(config.secretServerKey).toBeDefined();
		});
	});

	describe('StackAuthHeaders', () => {
		it('should validate headers structure', () => {
			const headers: StackAuthHeaders = {
				'X-Stack-Project-Id': 'test-project',
				'X-Stack-Access-Type': StackAuthAccessTypes.CLIENT,
				'X-Stack-Publishable-Client-Key': 'pk_test_123',
			};

			expect(headers['X-Stack-Project-Id']).toBeDefined();
			expect(headers['X-Stack-Access-Type']).toBeDefined();
		});
	});

	describe('StackAuthOptions', () => {
		it('should validate options with logger', () => {
			const options: StackAuthOptions = {
				stackAuth: {
					projectId: 'test-project',
					accessType: StackAuthAccessTypes.CLIENT,
				},
				logger: LogLevel.INFO,
				global: true,
			};

			expect(options.stackAuth).toBeDefined();
			expect(options.logger).toBe(LogLevel.INFO);
		});
	});

	describe('StackAuthOptionsFactory', () => {
		it('should validate factory implementation', async () => {
			class TestFactory implements StackAuthOptionsFactory {
				async createStackAuthOptions(): Promise<StackAuthOptions> {
					return {
						stackAuth: {
							projectId: 'test-project',
							accessType: StackAuthAccessTypes.CLIENT,
						},
						logger: LogLevel.INFO,
					};
				}
			}

			const factory = new TestFactory();
			const options = await factory.createStackAuthOptions();

			expect(options.stackAuth).toBeDefined();
			expect(options.stackAuth.projectId).toBe('test-project');
		});
	});
});
