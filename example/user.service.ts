import { Injectable } from '@nestjs/common';
import { InjectStackAuthRepository } from '../src/decorators/inject-stack-auth.decorator';

import { UsersServerService } from '../src/repositories/server/users.server.service';
import { IUserQueryParams } from '../src/interfaces/user.interface';
import { User } from '../src/models/user.model';

@Injectable()
export class UserService {
	constructor(@InjectStackAuthRepository('server.users') private readonly usersRepository: UsersServerService) {}

	async getUser(userId: string): Promise<User> {
		return this.usersRepository.getUser(userId).then((user) =>
			user.update({
				display_name: 'maria 2',
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
		return this.usersRepository
			.delete(userId)
			.then((response) => response.success)
			.catch(() => false);
	}

	async create(data: Partial<User>): Promise<User> {
		const { primary_email } = data;
		return this.usersRepository.create({ ...data, primary_email });
	}

	async list(params?: IUserQueryParams): Promise<{ users: User[]; nextCursor?: string; total?: number }> {
		return this.usersRepository.list(params);
	}
}
