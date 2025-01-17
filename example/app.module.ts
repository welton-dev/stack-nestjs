import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { StackAuthModule } from '../src/stack-auth.module';
import { StackAuthAccessTypes } from '../src/interfaces/stack-auth-config.interface';
import { UserModule } from './user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { REQUEST } from '@nestjs/core';

/**
 * The application module, which imports the necessary modules and sets up the
 * GraphQL endpoint.
 *
 * This module is imported by the root application module, and exports the
 * `StackAuthModule` so that it can be imported by other modules.
 *
 * The `StackAuthModule` is imported with the `registerAsync` method, which
 * allows it to be configured using environment variables.
 *
 * The `GraphQLModule` is also imported, with the `forRoot` method, which sets up
 * the GraphQL endpoint.
 *
 * The `UserModule` is also imported, which sets up the GraphQL resolvers for the
 * `User` entity.
 *
 * The `DevtoolsModule` is imported with the `register` method, which sets up the
 * devtools integration.
 */
@Module({
	imports: [
		DevtoolsModule.register({
			http: true,
		}),
		ConfigModule.forRoot({
			envFilePath: '.env.local',
			isGlobal: true,
		}),
		StackAuthModule.registerAsync({
			inject: [ConfigService, REQUEST],
			useFactory: async (configService: ConfigService, requesta: Request) => ({
				baseURL: configService.getOrThrow<string>('STACKAUTH_BASE_URL'),
				logger: new Logger('StackAuthModule'),
				stackAuth: {
					accessType: configService.getOrThrow<StackAuthAccessTypes>('STACKAUTH_ACCESS_TYPE'),
					projectId: configService.getOrThrow<string>('STACKAUTH_PROJECT_ID'),
					//publishableClientKey: configService.getOrThrow<string>('STACKAUTH_PUBLISHABLE_CLIENT_KEY'),
					secretServerKey: configService.getOrThrow<string>('STACKAUTH_SECRET_SERVER_KEY'),
				},
			}),
		}),
		// StackAuthModule.register({
		// 	headers: {
		// 		//'Content-Type': 'application/json',
		// 	},
		// 	validateStatus: (status) => status < 500,
		// 	baseURL: process.env.STACKAUTH_BASE_URL,
		// 	stackAuth: {
		// 		accessType: process.env.STACKAUTH_ACCESS_TYPE as StackAuthAccessTypes,
		// 		projectId: process.env.STACKAUTH_PROJECT_ID,
		// 		//publishableClientKey: configService.getOrThrow<string>('STACKAUTH_PUBLISHABLE_CLIENT_KEY'),
		// 		secretServerKey: process.env.STACKAUTH_SECRET_SERVER_KEY,
		// 	},
		// }),
		UserModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: true,
			debug: true,
			autoSchemaFile: join(process.cwd(), 'example/graphql/schema.graphql'),
			sortSchema: true,
		}),
	],
	exports: [StackAuthModule],
})
export class AppModule {}
