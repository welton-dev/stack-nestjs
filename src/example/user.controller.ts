import { Controller, Get, Put, Delete, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('me')
	async getCurrentUser(): Promise<IUser | null> {
		return await this.userService.getCurrentUser();
	}

	@Put('meupate')
	async updateProfile(@Body('displayName') displayName: string, @Body('primaryEmail') primaryEmail: string): Promise<User> {
		return this.userService.updateUserProfile(displayName, primaryEmail);
	}

	@Delete('medelete')
	async deleteAccount(): Promise<boolean> {
		return this.userService.deleteCurrentUser();
	}
}
