import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getCurrentUser(): Promise<User> {
		return this.userRepository.getCurrentUser();
	}

	async updateUserProfile(displayName: string, primaryEmail: string): Promise<User> {
		return this.userRepository.updateUser({
			display_name: displayName,
			primary_email: primaryEmail,
		});
	}

	async deleteCurrentUser(): Promise<boolean> {
		return this.userRepository.deleteUser();
	}
}
