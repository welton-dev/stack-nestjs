import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UsersServerService } from '../../../src/repositories/server/users.server.service';
import { ApiClientService } from '../../../src/services/api-client.service';
import { STACK_AUTH_LOGGER } from '../../../src/provider.declarations';
import { User } from '../../../src/models/user.model';
import { IUser } from '../../../src/interfaces/user.interface';
import { createMock } from '@golevelup/ts-jest';

describe('UsersServerService', () => {
	let service: UsersServerService;
	let apiClient: jest.Mocked<ApiClientService>;
	let logger: Logger;

	const mockUser: IUser = {
		id: '123',
		primary_email: 'test@example.com',
		display_name: 'Test User',
		primary_email_verified: true,
		primary_email_auth_enabled: false,
		signed_up_at_millis: Date.now(),
		last_active_at_millis: Date.now(),
		selected_team: null,
		selected_team_id: null,
		profile_image_url: null,
		client_metadata: null,
		client_read_only_metadata: null,
		server_metadata: null,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersServerService,
				{
					provide: ApiClientService,
					useValue: createMock<ApiClientService>(),
				},
				{
					provide: STACK_AUTH_LOGGER,
					useValue: createMock<Logger>(),
				},
			],
		}).compile();

		service = module.get<UsersServerService>(UsersServerService);
		apiClient = module.get(ApiClientService);
		logger = module.get(STACK_AUTH_LOGGER);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getUser', () => {
		it('should get user by id', async () => {
			apiClient.get.mockResolvedValue(mockUser);

			const result = await service.getUser('123');

			expect(result).toBeInstanceOf(User);
			expect(result.id).toBe(mockUser.id);
			expect(apiClient.get).toHaveBeenCalledWith('/users/123');
		});

		it('should throw error when get fails', async () => {
			apiClient.get.mockRejectedValue(new Error('API Error'));

			await expect(service.getUser('123')).rejects.toThrow('Failed to get user');
		});
	});

	describe('delete', () => {
		it('should delete user by id', async () => {
			apiClient.delete.mockResolvedValue({ success: true });

			const result = await service.delete('123');

			expect(result).toBeInstanceOf(Object);
			expect(result.success).toBe(true);
			expect(apiClient.delete).toHaveBeenCalledWith('/users/123');
		});
	});

	describe('create', () => {
		it('should create new user instance', async () => {
			apiClient.post.mockResolvedValue({ ...mockUser, display_name: 'New User', primary_email: 'new@example.com' });
			const userData = { display_name: 'New User', primary_email: 'new@example.com' };
			const result = await service.create(userData);

			expect(result).toBeInstanceOf(User);
			expect(result.display_name).toBe(userData.display_name);
			expect(result.primary_email).toBe(userData.primary_email);
		});
	});

	describe('list', () => {
		const mockUserList = {
			users: [mockUser],
			total: 1,
			limit: 10,
			offset: 0,
		};

		it('should list users with query params', async () => {
			apiClient.get.mockResolvedValue(mockUserList);

			const params = { limit: 10, offset: 0 };
			const result = await service.list(params);

			expect(result.users[0]).toBeInstanceOf(User);
			expect(result.total).toBe(mockUserList.total);
			expect(apiClient.get).toHaveBeenCalledWith('/users', { params });
		});

		it('should throw error when list fails', async () => {
			apiClient.get.mockRejectedValue(new Error('API Error'));

			await expect(service.list({})).rejects.toThrow('API Error');
		});
	});
});
