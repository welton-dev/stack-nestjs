import { Inject, Injectable, Logger } from '@nestjs/common';
import { StackAuthService } from '../../decorators/stack-auth-service.decorator';
import { STACK_AUTH_LOGGER } from '../../provider.declarations';
import { ApiClientService } from '../../services/api-client.service';
import { SuccessResponse } from '../../interfaces/success-response.interface';
import { IUserQueryParams, IUserListResponse, IUser } from '../../interfaces/user.interface';
import { User } from '../../models/user.model';

@Injectable()
@StackAuthService({ type: 'server', name: 'users' })
export class UsersServerService {
	constructor(
		private readonly apiClient: ApiClientService,
		@Inject(STACK_AUTH_LOGGER) private readonly logger: Logger,
	) {}

	/**
	 *Retrieves a user based on the provided user ID
	 *@param userId ID of the user to be retrieved
	 *@returns User object
	 */
	async getUser(userId: string): Promise<User> {
		try {
			const userData = await this.apiClient.get<IUser>(`/users/${userId}`);
			return new User(userData, this.apiClient);
		} catch (error) {
			throw new Error('Failed to get user');
		}
	}

	/**
	 *Deletes a user based on the provided user ID
	 *@param userId ID of the user to be deleted
	 *@returns True if the user was deleted successfully, false otherwise
	 */
	async delete(userId: string): Promise<boolean> {
		try {
			const response = await this.apiClient.delete<SuccessResponse>(`/users/${userId}`);
			return response.success;
		} catch (error) {
			throw new Error('Failed to delete user');
		}
	}

	/**
	 *Creates a new user based on the data provided
	 *@param data User data to be created
	 *@returns User created
	 */
	create(data: Partial<IUser>): User {
		return new User(data, this.apiClient);
	}

	/**
	 *List users based on provided query parameters
	 *@param params Query parameters to filter, sort and page users
	 *@returns User list and pagination information
	 **Usage example:
	 *
	 *List all users
	 *const { users } = await userService.list();
	 *
	 *List users from a specific team
	 *const { users } = await userService.list({ team_id: 'team-123' });
	 *
	 *List users with pagination
	 *const { users, nextCursor } = await userService.list({ limit: 10 });
	 *
	 *Continue from cursor
	 *const { users: nextPage } = await userService.list({ cursor: nextCursor });
	 *
	 *Search users by text
	 *const { users } = await userService.list({ query: 'john@example.com' });
	 *
	 *Sort by descending registration date
	 *const { users } = await userService.list({ order_by: 'signed_up_at', desc: true });
	 */
	public async list(params?: IUserQueryParams): Promise<{ users: User[]; nextCursor?: string; total?: number }> {
		try {
			const response = await this.apiClient.get<IUserListResponse>('/users', { params });

			return {
				users: response.users.map((user) => new User(user).setApiClient(this.apiClient)),
				nextCursor: response.next_cursor,
				total: response.total,
			};
		} catch (error) {
			this.logger.error('Erro ao listar usuários:', error);
			throw error;
		}
	}
}
