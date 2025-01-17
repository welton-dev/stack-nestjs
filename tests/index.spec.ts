import * as stackAuth from '../src/index';
import { StackAuthModule } from '../src/stack-auth.module';
import { InjectStackAuthRepository } from '../src/decorators/inject-stack-auth.decorator';
import { StackAuthService } from '../src/decorators/stack-auth-service.decorator';
import { SetStackAuthOptions } from '../src/decorators/set-stack-auth-options';
import { User } from '../src/models/user.model';

describe('Index Exports', () => {
	it('should export all required modules and decorators', () => {
		// Módulo principal
		expect(stackAuth.StackAuthModule).toBeDefined();
		expect(stackAuth.StackAuthModule).toBe(StackAuthModule);

		// Decorators
		expect(stackAuth.InjectStackAuthRepository).toBeDefined();
		expect(stackAuth.InjectStackAuthRepository).toBe(InjectStackAuthRepository);
		expect(stackAuth.StackAuthService).toBeDefined();
		expect(stackAuth.StackAuthService).toBe(StackAuthService);
		expect(stackAuth.SetStackAuthOptions).toBeDefined();
		expect(stackAuth.SetStackAuthOptions).toBe(SetStackAuthOptions);

		// Interfaces de entidades
		expect(stackAuth.User).toBeDefined();
		expect(stackAuth.User).toBe(User);
	});

	it('should export all required types and interfaces', () => {
		// Verifica se os tipos estão sendo exportados
		expect(Object.keys(stackAuth)).toContain('StackAuthModule');
		expect(Object.keys(stackAuth)).toContain('InjectStackAuthRepository');
		expect(Object.keys(stackAuth)).toContain('StackAuthService');
		expect(Object.keys(stackAuth)).toContain('SetStackAuthOptions');
		expect(Object.keys(stackAuth)).toContain('User');
	});
});
