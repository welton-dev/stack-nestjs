# Stack Auth NestJS Module

Módulo NestJS para autenticação e gerenciamento de usuários usando Stack Auth.

## Instalação

```bash
yarn add @stack-auth/nestjs
```

## Configuração

### 1. Configurar Módulo

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StackAuthModule } from '@stack-auth/nestjs';

@Module({
	imports: [
		ConfigModule.forRoot(),
		StackAuthModule.registerAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				baseURL: configService.getOrThrow('STACKAUTH_BASE_URL'),
				stackAuth: {
					projectId: configService.getOrThrow('STACKAUTH_PROJECT_ID'),
					accessType: configService.getOrThrow('STACKAUTH_ACCESS_TYPE'),
					// Para modo cliente
					publishableClientKey: configService.get('STACKAUTH_PUBLISHABLE_CLIENT_KEY'),
					// Para modo servidor
					secretServerKey: configService.get('STACKAUTH_SECRET_SERVER_KEY'),
				},
			}),
		}),
	],
})
export class AppModule {}
```

### 2. Variáveis de Ambiente

```env
# .env
STACKAUTH_BASE_URL=https://api.stackauth.com
STACKAUTH_PROJECT_ID=seu-project-id
STACKAUTH_ACCESS_TYPE=server # ou client
STACKAUTH_SECRET_SERVER_KEY=sk_test_123 # apenas para modo servidor
STACKAUTH_PUBLISHABLE_CLIENT_KEY=pk_test_123 # apenas para modo cliente
```

## Uso

### 1. Criando um Serviço de Usuários

```typescript
// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectStackAuthRepository } from '@stack-auth/nestjs';
import { User } from '@stack-auth/nestjs/models';

@Injectable()
export class UsersService {
	constructor(
		@InjectStackAuthRepository('server.users')
		private readonly usersRepo: UsersServerService,
	) {}

	// Buscar e atualizar usuário
	async getUser(userId: string): Promise<User> {
		const user = await this.usersRepo.getUser(userId);
		return user.update({
			display_name: 'Novo Nome',
			primary_email_auth_enabled: false,
		});
	}

	// Atualizar perfil
	async updateProfile(userId: string, displayName: string, email: string): Promise<User> {
		const user = await this.usersRepo.getUser(userId);
		return user.update({
			display_name: displayName,
			primary_email: email,
		});
	}

	// Criar usuário
	async createUser(data: { primary_email: string; display_name?: string }): Promise<User> {
		return this.usersRepo.create(data);
	}

	// Listar usuários
	async listUsers(params?: { limit?: number; cursor?: string; query?: string; team_id?: string; order_by?: string; desc?: boolean }) {
		return this.usersRepo.list(params);
	}

	// Deletar usuário
	async deleteUser(userId: string): Promise<boolean> {
		return this.usersRepo
			.delete(userId)
			.then((response) => response.success)
			.catch(() => false);
	}
}
```

### 2. Usando com GraphQL

```typescript
// users.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InjectStackAuthRepository } from '@stack-auth/nestjs';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UsersResolver {
	constructor(
		@InjectStackAuthRepository('server.users')
		private readonly usersRepo: UsersServerService,
	) {}

	@Query(() => User)
	async user(@Args('id') id: string) {
		return this.usersRepo.getUser(id);
	}

	@Mutation(() => User)
	async updateUser(@Args('id') id: string, @Args('input') input: UpdateUserInput) {
		const user = await this.usersRepo.getUser(id);
		return user.update(input);
	}
}
```

### 3. Usando com REST

```typescript
// users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectStackAuthRepository } from '@stack-auth/nestjs';

@Controller('users')
export class UsersController {
	constructor(
		@InjectStackAuthRepository('server.users')
		private readonly usersRepo: UsersServerService,
	) {}

	@Get(':id')
	async getUser(@Param('id') id: string) {
		return this.usersRepo.getUser(id);
	}

	@Post()
	async createUser(@Body() data: CreateUserDto) {
		return this.usersRepo.create(data);
	}
}
```

## Repositories Disponíveis

| Nome     | Modo   | Injeção                                         |
| -------- | ------ | ----------------------------------------------- |
| Users    | Server | `@InjectStackAuthRepository('server.users')`    |
| Users    | Client | `@InjectStackAuthRepository('client.users')`    |
| Sessions | Server | `@InjectStackAuthRepository('server.sessions')` |

## Testes

Para testar sua aplicação com o módulo:

```typescript
describe('AppModule', () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [
				StackAuthModule.register({
					baseURL: 'http://test.com',
					stackAuth: {
						projectId: 'test-project',
						accessType: 'server',
						secretServerKey: 'sk_test_123',
					},
				}),
			],
		}).compile();
	});

	it('should be defined', () => {
		expect(module.get(ApiClientService)).toBeDefined();
		expect(module.get(UsersServerService)).toBeDefined();
	});
});
```

## Licença

MIT
