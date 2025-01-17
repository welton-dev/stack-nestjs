import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { JSONScalar } from './graphql/scalars/json.scalar';
import { UserController } from './user.controller';

@Module({
	imports: [],
	providers: [UserService, UserResolver, JSONScalar],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
