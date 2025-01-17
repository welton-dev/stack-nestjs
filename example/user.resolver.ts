import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './graphql/inputs/update-user.input';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => User)
	async me(@Args('userId') userId: string): Promise<User> {
		return new User(await this.userService.getUser(userId));
	}

	@Mutation(() => User)
	async updateMe(@Args('userId') userId: string, @Args('input') input: UpdateUserInput): Promise<User> {
		return new User(await this.userService.updateUserProfile(userId, input.displayName, input.primaryEmail));
	}

	@Mutation(() => Boolean)
	async deleteMe(@Args('userId') userId: string): Promise<boolean> {
		return this.userService.deleteCurrentUser(userId);
	}
}
