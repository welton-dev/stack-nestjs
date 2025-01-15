import { Controller, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get(':userId')
	async getCurrentUser(@Param('userId') userId: string): Promise<User | null> {
		console.log(userId);
		return await this.userService.getUser(userId);
	}

	@Put(':userId')
	async updateProfile(
		@Param('userId') userId: string,
		@Body('displayName') displayName: string,
		@Body('primaryEmail') primaryEmail: string,
	): Promise<User> {
		return this.userService.updateUserProfile(userId, displayName, primaryEmail);
	}

	@Delete(':userId')
	async deleteAccount(@Param('userId') userId: string): Promise<boolean> {
		return this.userService.deleteCurrentUser(userId);
	}
}
