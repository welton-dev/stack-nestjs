import { Inject, Injectable, Logger } from '@nestjs/common';
import { StackAuthService } from '../../decorators/stack-auth-service.decorator';
import { STACK_AUTH_LOGGER } from '../../provider.declarations';
import { ApiClientService } from '../../services/api-client.service';
import { User } from '../../entities/user.entity';
import { SuccessResponse } from '../../interfaces/success-response.interface';

@Injectable()
@StackAuthService({ type: 'server', name: 'users' })
export class UsersServerService {
	constructor(
		private readonly apiClient: ApiClientService,
		@Inject(STACK_AUTH_LOGGER) private readonly logger: Logger,
	) {}

	async getUser(userId: string): Promise<User> {
		try {
			const userData = await this.apiClient.get<User>(`/users/${userId}`);
			return new User(userData);
		} catch (error) {
			throw new Error('Failed to get user');
		}
	}

	async deleteUser(userId: string): Promise<boolean> {
		try {
			const response = await this.apiClient.delete<SuccessResponse>(`/users/${userId}`);
			return response.success;
		} catch (error) {
			throw new Error('Failed to delete user');
		}
	}

	async updateUser(data: Partial<User>): Promise<User> {
		try {
			const userData = await this.apiClient.patch<User>(`/users/${data.id}`, data);
			return new User(userData);
		} catch (error) {
			throw new Error('Failed to update user');
		}
	}

	create(data: Partial<User>): User {
		return new User(data);
	}
}
