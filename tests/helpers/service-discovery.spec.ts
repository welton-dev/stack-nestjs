import { ServiceDiscoveryHelper } from '../../src/helpers/service-discovery';
import { STACK_AUTH_SERVICE } from '../../src/provider.declarations';
import { STACK_AUTH_SERVICE_METADATA } from '../../src/decorators/stack-auth-service.decorator';

describe('ServiceDiscoveryHelper', () => {
	class TestService1 {}
	class TestService2 {}
	class TestService3 {}

	beforeEach(() => {
		// Limpa metadados antes de cada teste
		Reflect.deleteMetadata(STACK_AUTH_SERVICE_METADATA, TestService1);
		Reflect.deleteMetadata(STACK_AUTH_SERVICE_METADATA, TestService2);
		Reflect.deleteMetadata(STACK_AUTH_SERVICE_METADATA, TestService3);
	});

	describe('discoverServices', () => {
		it('should discover services with metadata', () => {
			Reflect.defineMetadata(STACK_AUTH_SERVICE_METADATA, { type: 'client', name: 'test1' }, TestService1);
			Reflect.defineMetadata(STACK_AUTH_SERVICE_METADATA, { type: 'server', name: 'test2' }, TestService2);

			const providers = ServiceDiscoveryHelper.discoverServices([TestService1, TestService2, TestService3]);

			expect(providers).toHaveLength(4); // 2 serviços * 2 providers cada
			expect(providers).toContainEqual(TestService1);
			expect(providers).toContainEqual(TestService2);
			expect(providers).toContainEqual({
				provide: `${STACK_AUTH_SERVICE}.client.test1`,
				useClass: TestService1,
			});
			expect(providers).toContainEqual({
				provide: `${STACK_AUTH_SERVICE}.server.test2`,
				useClass: TestService2,
			});
		});

		it('should ignore services without metadata', () => {
			Reflect.defineMetadata(STACK_AUTH_SERVICE_METADATA, { type: 'client', name: 'test1' }, TestService1);

			const providers = ServiceDiscoveryHelper.discoverServices([TestService1, TestService3]);

			expect(providers).toHaveLength(2); // 1 serviço * 2 providers
			expect(providers).toContainEqual(TestService1);
			expect(providers).toContainEqual({
				provide: `${STACK_AUTH_SERVICE}.client.test1`,
				useClass: TestService1,
			});
		});

		it('should return empty array when no services have metadata', () => {
			const providers = ServiceDiscoveryHelper.discoverServices([TestService3]);
			expect(providers).toHaveLength(0);
		});
	});

	describe('getServiceTokens', () => {
		it('should return tokens for services with metadata', () => {
			Reflect.defineMetadata(STACK_AUTH_SERVICE_METADATA, { type: 'client', name: 'test1' }, TestService1);
			Reflect.defineMetadata(STACK_AUTH_SERVICE_METADATA, { type: 'server', name: 'test2' }, TestService2);

			const tokens = ServiceDiscoveryHelper.getServiceTokens([TestService1, TestService2, TestService3]);

			expect(tokens).toHaveLength(2);
			expect(tokens).toContain(`${STACK_AUTH_SERVICE}.client.test1`);
			expect(tokens).toContain(`${STACK_AUTH_SERVICE}.server.test2`);
		});

		it('should ignore services without metadata', () => {
			Reflect.defineMetadata(STACK_AUTH_SERVICE_METADATA, { type: 'client', name: 'test1' }, TestService1);

			const tokens = ServiceDiscoveryHelper.getServiceTokens([TestService1, TestService3]);

			expect(tokens).toHaveLength(1);
			expect(tokens).toContain(`${STACK_AUTH_SERVICE}.client.test1`);
		});

		it('should return empty array when no services have metadata', () => {
			const tokens = ServiceDiscoveryHelper.getServiceTokens([TestService3]);
			expect(tokens).toHaveLength(0);
		});
	});
});
