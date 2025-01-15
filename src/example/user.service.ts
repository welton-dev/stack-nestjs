import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectStackAuthRepository } from '../decorators/inject-stack-auth.decorator';

import { UsersServerService } from '../repositories/server/users.server.service';

@Injectable()
export class UserService {
	constructor(@InjectStackAuthRepository('server.users') private readonly usersRepository: UsersServerService) {}

	async getUser(userId: string): Promise<User> {
		return this.usersRepository.getUser(userId);
	}

	async updateUserProfile(userId: string, displayName: string, primaryEmail: string): Promise<User> {
		return this.usersRepository.getUser(userId).then((user) =>
			user.update({
				display_name: displayName,
				primary_email: primaryEmail,
			}),
		);
	}

	async deleteCurrentUser(userId: string): Promise<boolean> {
		return this.usersRepository.deleteUser(userId);
	}

	async create(data: Partial<User>): Promise<User> {
		return this.usersRepository.create(data);
	}
}
