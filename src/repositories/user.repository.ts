import { Injectable, Logger, Inject } from '@nestjs/common';
import { ApiClientService } from '../client';
import { User } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import { SuccessResponse } from '../interfaces/success-response.interface';
import { STACK_AUTH_LOGGER } from '../provider.declarations';

@Injectable()
export class UserRepository {
	constructor(
		private readonly apiClient: ApiClientService,
		@Inject(STACK_AUTH_LOGGER) private readonly logger: Logger,
	) {}

	async getCurrentUser(): Promise<User> {
		try {
			const userData = await this.apiClient.get<User>('/users/me');
			return new User(userData);
		} catch (error) {
			throw new Error('Failed to get user');
		}
	}

	async deleteUser(): Promise<boolean> {
		try {
			const response = await this.apiClient.delete<SuccessResponse>('/users/me');
			return response.success;
		} catch (error) {
			throw new Error('Failed to delete user');
		}
	}

	async updateUser(data: Partial<IUser>): Promise<User> {
		try {
			const userData = await this.apiClient.patch<User>('/users/me', data);
			return new User(userData);
		} catch (error) {
			throw new Error('Failed to update user');
		}
	}

	create(data: Partial<User>): User {
		return new User(data);
	}
}
