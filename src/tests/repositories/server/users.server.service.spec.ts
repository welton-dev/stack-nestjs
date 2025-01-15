import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { UsersServerService } from '../../../repositories/server/users.server.service';
import { ApiClientService } from '../../../services/api-client.service';
import { STACK_AUTH_LOGGER } from '../../../provider.declarations';
import { User } from '../../../models/user.model';
import { IUser } from '../../../interfaces/user.interface';
import { createMock } from '@golevelup/ts-jest';

jest.mock('../../../services/api-client.service');

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

			expect(result).toBe(true);
			expect(apiClient.delete).toHaveBeenCalledWith('/users/123');
		});

		it('should throw error when delete fails', async () => {
			apiClient.delete.mockRejectedValue(new Error('API Error'));

			await expect(service.delete('123')).rejects.toThrow('Failed to delete user');
		});
	});

	describe('create', () => {
		it('should create new user instance', () => {
			const userData = { display_name: 'New User' };
			const result = service.create(userData);

			expect(result).toBeInstanceOf(User);
			expect(result.display_name).toBe(userData.display_name);
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
