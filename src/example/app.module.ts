import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { StackAuthModule } from '../stack-auth.module';
import { StackAuthAccessTypes } from '../interfaces/stackauth-module-option';
import { UserModule } from './user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env.test',
			isGlobal: true,
		}),
		StackAuthModule.registerAsync({
			inject: [ConfigService],
			global: true,
			useFactory: async (configService: ConfigService) => ({
				accessType: configService.getOrThrow<StackAuthAccessTypes>('STACKAUTH_ACCESS_TYPE'),
				stackAuth: {
					baseURL: configService.getOrThrow<string>('STACKAUTH_BASE_URL'),
					projectId: configService.getOrThrow<string>('STACKAUTH_PROJECT_ID'),
					publishableClientKey: configService.getOrThrow<string>('STACKAUTH_PUBLISHABLE_CLIENT_KEY'),
				},
			}),
		}),
		UserModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: true,
			debug: true,
			autoSchemaFile: join(process.cwd(), 'schema.graphql'),
			sortSchema: true,
		}),
	],
})
export class AppModule {}
