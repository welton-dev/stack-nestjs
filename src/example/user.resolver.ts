import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserInput } from './graphql/inputs/update-user.input';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Query(() => User)
	async me(): Promise<User> {
		return this.userService.getCurrentUser();
	}

	@Mutation(() => User)
	async updateMe(@Args('input') input: UpdateUserInput): Promise<User> {
		return this.userService.updateUserProfile(input.displayName, input.primaryEmail);
	}

	@Mutation(() => Boolean)
	async deleteMe(): Promise<boolean> {
		return this.userService.deleteCurrentUser();
	}
}
