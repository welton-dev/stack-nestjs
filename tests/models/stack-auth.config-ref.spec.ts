import { StackAuthConfigRef } from '../../models/stack-auth.config-ref';
import { StackAuthAccessTypes } from '../../interfaces/stack-auth-config.interface';
import { StackAuthOptions } from '../../interfaces/stack-auth-options';

describe('StackAuthConfigRef', () => {
	let config: StackAuthConfigRef;
	let options: StackAuthOptions;

	beforeEach(() => {
		options = {
			stackAuth: {
				projectId: 'test-project',
				accessType: StackAuthAccessTypes.CLIENT,
				publishableClientKey: 'pk_test_123',
			},
			baseURL: 'https://api.example.com',
		};
		config = new StackAuthConfigRef(options);
	});

	it('should create an instance', () => {
		expect(config).toBeInstanceOf(StackAuthConfigRef);
	});

	it('should return the value through valueOf getter', () => {
		expect(config.valueOf).toBe(options);
	});

	it('should set auth token', () => {
		const newToken = 'new_token';
		config.setAuthToken(newToken);
		expect(config.valueOf.baseURL).toBe(newToken);
	});

	it('should maintain reference to original options', () => {
		const newToken = 'new_token';
		config.setAuthToken(newToken);
		expect(options.baseURL).toBe(newToken);
	});
});
