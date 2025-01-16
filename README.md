# Stack Auth NestJS Module

[![CI](https://github.com/welton-dev/stack-nestjs/actions/workflows/ci.yml/badge.svg)](https://github.com/welton-dev/stack-nestjs/actions)
[![codecov](https://codecov.io/gh/welton-dev/stack-nestjs/branch/main/graph/badge.svg)](https://codecov.io/gh/welton-dev/stack-nestjs)
[![npm version](https://badge.fury.io/js/@stackauth%2Fnestjs.svg)](https://badge.fury.io/js/@stackauth%2Fnestjs)
[![NPM Downloads](https://img.shields.io/npm/dm/@stackauth/nestjs.svg)](https://www.npmjs.com/package/@stackauth/nestjs)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/node/v/@stackauth/nestjs)](https://nodejs.org/en/)

NestJS module for user authentication and management using Stack Auth.

## Installation

```bash
yarn add @stack-auth/nestjs
```

## Configuration

### 1. Configure Module

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
					// For client mode
					publishableClientKey: configService.get('STACKAUTH_PUBLISHABLE_CLIENT_KEY'),
					// For server mode
					secretServerKey: configService.get('STACKAUTH_SECRET_SERVER_KEY'),
				},
			}),
		}),
	],
})
export class AppModule {}
```

### 2. Environment Variables

```env
# .env
STACKAUTH_BASE_URL=https://api.stackauth.com
STACKAUTH_PROJECT_ID=your-project-id
STACKAUTH_ACCESS_TYPE=server # or client
STACKAUTH_SECRET_SERVER_KEY=sk_test_123 # only for server mode
STACKAUTH_PUBLISHABLE_CLIENT_KEY=pk_test_123 # only for client mode
```

## Usage

### 1. Creating a Users Service

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

	// Get and update user
	async getUser(userId: string): Promise<User> {
		const user = await this.usersRepo.getUser(userId);
		return user.update({
			display_name: 'New Name',
			primary_email_auth_enabled: false,
		});
	}

	// Update profile
	async updateProfile(userId: string, displayName: string, email: string): Promise<User> {
		const user = await this.usersRepo.getUser(userId);
		return user.update({
			display_name: displayName,
			primary_email: email,
		});
	}

	// Create user
	async createUser(data: { primary_email: string; display_name?: string }): Promise<User> {
		return this.usersRepo.create(data);
	}

	// List users
	async listUsers(params?: { limit?: number; cursor?: string; query?: string; team_id?: string; order_by?: string; desc?: boolean }) {
		return this.usersRepo.list(params);
	}

	// Delete user
	async deleteUser(userId: string): Promise<boolean> {
		return this.usersRepo
			.delete(userId)
			.then((response) => response.success)
			.catch(() => false);
	}
}
```

### 2. Using with GraphQL

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

### 3. Using with REST

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

## Available Repositories

> **Note**: When using the `@InjectStackAuthRepository()` decorator without parameters, you will have access to all repositories (client and server) through the injected service.

### Server Mode

| Name     | Injection                                       |
| -------- | ----------------------------------------------- |
| Users    | `@InjectStackAuthRepository('server.users')`    |
| Sessions | `@InjectStackAuthRepository('server.sessions')` |

### Client Mode

| Name     | Injection                                       |
| -------- | ----------------------------------------------- |
| Users    | `@InjectStackAuthRepository('client.users')`    |

## Testing

To test your application with the module:

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
		expect(module).toBeDefined();
	});
});
```

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/) using [Semantic Release](https://semantic-release.gitbook.io/). The version numbers are automatically managed based on commit messages.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

#### Types
- `feat`: A new feature (triggers a MINOR version bump)
- `fix`: A bug fix (triggers a PATCH version bump)
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `style`: Changes that do not affect the meaning of the code
- `test`: Adding missing tests or correcting existing tests
- `docs`: Documentation only changes
- `chore`: Changes to the build process or auxiliary tools
- `ci`: Changes to CI configuration files and scripts
- `revert`: Reverts a previous commit

#### Breaking Changes
- Adding `BREAKING CHANGE:` in the commit footer will trigger a MAJOR version bump
- Example:
```
feat(auth): change authentication API

BREAKING CHANGE: The authentication API has been completely revamped.
Previous methods will no longer work.
```

#### Version Bumping Rules
- **MAJOR** version (1.0.0 → 2.0.0)
  - When making incompatible API changes
  - Triggered by `BREAKING CHANGE:` in commit message
- **MINOR** version (1.0.0 → 1.1.0)
  - When adding functionality in a backwards compatible manner
  - Triggered by `feat:` commits
- **PATCH** version (1.0.0 → 1.0.1)
  - When making backwards compatible bug fixes
  - Triggered by `fix:` commits

#### Examples

```bash
# Minor Feature Release (1.0.0 → 1.1.0)
git commit -m "feat(users): add email verification endpoint"

# Patch Release (1.0.0 → 1.0.1)
git commit -m "fix(auth): resolve token expiration issue"

# Major Release with Breaking Change (1.0.0 → 2.0.0)
git commit -m "feat(auth): implement OAuth2 authentication

BREAKING CHANGE: Previous authentication methods are deprecated.
Users need to migrate to OAuth2."

# No Version Change
git commit -m "docs: update API documentation"
git commit -m "style: format code according to new rules"
git commit -m "test: add unit tests for user service"
```

## License

MIT
