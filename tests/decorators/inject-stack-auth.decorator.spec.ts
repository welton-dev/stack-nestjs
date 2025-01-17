import { InjectStackAuthRepository } from '../../src/decorators/inject-stack-auth.decorator';
import { STACK_AUTH_SERVICE } from '../../src/provider.declarations';

describe('InjectStackAuthRepository', () => {
	class TestService {}

	it('should return Inject with base token when no path is provided', () => {
		const decorator = InjectStackAuthRepository();
		decorator(TestService, 'property', 0);
		const dependencies = Reflect.getMetadata('self:paramtypes', TestService) || [];
		expect(dependencies[0].param).toBe(STACK_AUTH_SERVICE);
	});

	it('should return Inject with type when only type is provided', () => {
		const decorator = InjectStackAuthRepository('users');
		decorator(TestService, 'property', 0);
		const dependencies = Reflect.getMetadata('self:paramtypes', TestService) || [];
		expect(dependencies[1].param).toBe(`${STACK_AUTH_SERVICE}.users`);
	});

	it('should return Inject with type and service when both are provided', () => {
		const decorator = InjectStackAuthRepository('users.client');
		decorator(TestService, 'property', 0);
		const dependencies = Reflect.getMetadata('self:paramtypes', TestService) || [];
		expect(dependencies[2].param).toBe(`${STACK_AUTH_SERVICE}.users.client`);
	});
});
