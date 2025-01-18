import { User } from '../../src/models/user.model';
import { ApiClientService } from '../../src/services/api-client.service';
import { IUser } from '../../src/interfaces/user.interface';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { StackAuthAccessTypes } from '../../src/interfaces/stack-auth-config.interface';
import { createMock } from '@golevelup/ts-jest';

jest.mock('../../src/services/api-client.service');

describe('User', () => {
	let user: User;
	let apiClient: jest.Mocked<ApiClientService>;
	const mockUserData: Partial<IUser> = {
		id: '123',
		primary_email: 'test@example.com',
		display_name: 'Test User',
		primary_email_verified: true,
		primary_email_auth_enabled: false,
		signed_up_at_millis: Date.now(),
		last_active_at_millis: Date.now(),
	};

	beforeEach(() => {
		const httpService = new HttpService();
		const logger = createMock<Logger>();
		const options = {
			stackAuth: {
				projectId: 'test-project',
				accessType: StackAuthAccessTypes.CLIENT,
			},
		};

		apiClient = new ApiClientService(httpService, logger, options) as jest.Mocked<ApiClientService>;
		user = new User(mockUserData, apiClient);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('constructor', () => {
		it('should create instance with data', () => {
			expect(user.id).toBe(mockUserData.id);
			expect(user.primary_email).toBe(mockUserData.primary_email);
			expect(user.display_name).toBe(mockUserData.display_name);
		});

		it('should create instance without apiClient', () => {
			const userWithoutApi = new User(mockUserData);
			expect(userWithoutApi.id).toBe(mockUserData.id);
		});
	});

	describe('setApiClient', () => {
		it('should set api client and return instance', () => {
			const httpService = new HttpService();
			const logger = createMock<Logger>();
			const options = {
				stackAuth: {
					projectId: 'test-project',
					accessType: StackAuthAccessTypes.CLIENT,
				},
			};

			const newApiClient = new ApiClientService(httpService, logger, options) as jest.Mocked<ApiClientService>;
			const result = user.setApiClient(newApiClient);
			expect(result).toBe(user);
		});
	});

	describe('delete', () => {
		it('should delete user and return success', async () => {
			apiClient.delete = jest.fn().mockResolvedValue({ success: true });
			const result = await user.delete();
			expect(result).toBe(true);
			expect(apiClient.delete).toHaveBeenCalledWith('/users/123');
		});
	});

	describe('update', () => {
		it('should update user and return new instance', async () => {
			const updateData = { display_name: 'Updated Name' };
			const updatedUserData = { ...mockUserData, ...updateData };
			apiClient.patch = jest.fn().mockResolvedValue(updatedUserData);

			const updatedUser = await user.update(updateData);

			expect(updatedUser).toBeInstanceOf(User);
			expect(updatedUser.display_name).toBe(updateData.display_name);
			expect(apiClient.patch).toHaveBeenCalledWith('/users/123', updateData);
		});
	});

	describe('save', () => {
		it('should save user and return new instance', async () => {
			const savedUserData = { ...mockUserData, client_metadata: { key: 'value' } };
			apiClient.patch = jest.fn().mockResolvedValue(savedUserData);

			const savedUser = await user.save();

			expect(savedUser).toBeInstanceOf(User);
			expect(savedUser.client_metadata).toEqual({ key: 'value' });
			expect(apiClient.patch).toHaveBeenCalledWith('/users/123', user);
		});
	});

	describe('toJSON', () => {
		it('should return object without apiClient', () => {
			const json = user.toJSON();
			expect(json).not.toHaveProperty('apiClient');
			expect(json).toHaveProperty('id', mockUserData.id);
		});
	});
});
