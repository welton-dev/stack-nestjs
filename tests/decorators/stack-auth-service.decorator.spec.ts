import { STACK_AUTH_SERVICE_METADATA, StackAuthService } from '../../src/decorators/stack-auth-service.decorator';
import { Reflector } from '@nestjs/core';

describe('StackAuthService', () => {
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
	});

	it('should set metadata correctly', () => {
		// Define a test class
		@StackAuthService({ type: 'client', name: 'users' })
		class TestService {}

		// Get metadata using reflector
		const metadata = Reflect.getMetadata(STACK_AUTH_SERVICE_METADATA, TestService);

		// Assert metadata
		expect(metadata).toEqual({
			type: 'client',
			name: 'users',
		});
	});

	it('should set metadata with server type', () => {
		@StackAuthService({ type: 'server', name: 'teams' })
		class TestService {}

		const metadata = Reflect.getMetadata(STACK_AUTH_SERVICE_METADATA, TestService);

		expect(metadata).toEqual({
			type: 'server',
			name: 'teams',
		});
	});
});
