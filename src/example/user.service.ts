import { Injectable } from '@nestjs/common';
import { InjectStackAuthRepository } from '../decorators/inject-stack-auth.decorator';

import { UsersServerService } from '../repositories/server/users.server.service';
import { IUserQueryParams } from '../interfaces/user.interface';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
	constructor(@InjectStackAuthRepository('server.users') private readonly usersRepository: UsersServerService) {}

	async getUser(userId: string): Promise<User> {
		return this.usersRepository.getUser(userId).then(
			async (user) =>
				await user.update({
					display_name: 'John Doe Maria',
					primary_email_auth_enabled: false,
				}),
		);
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
		return this.usersRepository.delete(userId);
	}

	async create(data: Partial<User>): Promise<User> {
		return this.usersRepository.create(data);
	}

	async list(params?: IUserQueryParams): Promise<{ users: User[]; nextCursor?: string; total?: number }> {
		return this.usersRepository.list(params);
	}
}
