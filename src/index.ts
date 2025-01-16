// Módulo principal
export { StackAuthModule } from './stack-auth.module';

// Interfaces de configuração
export { StackAuthOptions } from './interfaces/stack-auth-options';
export { StackAuthHeaders, StackAuthConfig } from './interfaces/stack-auth-config.interface';
export { StackAuthServiceMetadata } from './decorators/stack-auth-service.decorator';

// Decorators
export { InjectStackAuthRepository } from './decorators/inject-stack-auth.decorator';
export { StackAuthService } from './decorators/stack-auth-service.decorator';
export { SetStackAuthOptions } from './decorators/set-stack-auth-options';

// Interfaces de entidades
export { User } from './models/user.model';

// Interfaces de serviços
export { StackAuthServices } from './interfaces/stack-auth-services.interface';

// Tipos comuns
export * from './types';
export * from './interfaces/success-response.interface';
export * from './interfaces/user.interface';
export * from './interfaces/team.interface';
