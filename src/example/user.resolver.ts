import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserInput } from './graphql/inputs/update-user.input';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => User)
	async me(@Args('userId') userId: string): Promise<User> {
		return this.userService.getUser(userId);
	}

	@Mutation(() => User)
	async updateMe(@Args('userId') userId: string, @Args('input') input: UpdateUserInput): Promise<User> {
		return this.userService.updateUserProfile(userId, input.displayName, input.primaryEmail);
	}

	@Mutation(() => Boolean)
	async deleteMe(@Args('userId') userId: string): Promise<boolean> {
		return this.userService.deleteCurrentUser(userId);
	}
}
