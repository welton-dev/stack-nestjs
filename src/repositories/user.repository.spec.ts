import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { ApiClientService } from '../client';
import { mockUser } from '../test/mocks/user.mock';
import { User } from '../entities/user.entity';
import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { STACK_AUTH_LOGGER } from '../provider.declarations';

describe('UserRepository', () => {
	let repository: UserRepository;
	let apiClientService: ApiClientService;
	let _logger: Logger;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: ApiClientService,
					useValue: createMock<ApiClientService>(),
				},
				{
					provide: STACK_AUTH_LOGGER,
					useValue: createMock<Logger>(),
				},
				UserRepository,
			],
		}).compile();

		repository = module.get<UserRepository>(UserRepository);
		apiClientService = module.get<ApiClientService>(ApiClientService);
		_logger = module.get<Logger>(STACK_AUTH_LOGGER);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getCurrentUser', () => {
		it('should return a User entity with the current user data', async () => {
			jest.spyOn(apiClientService, 'get').mockResolvedValue(mockUser);

			const user = await repository.getCurrentUser();

			expect(user).toBeInstanceOf(User);
			expect(user.display_name).toBe(mockUser.display_name);
			expect(user.primary_email).toBe(mockUser.primary_email);
		});

		it('should throw an error when the request fails', async () => {
			const error = new Error('Request failed');
			jest.spyOn(apiClientService, 'get').mockRejectedValue(error);

			await expect(repository.getCurrentUser()).rejects.toThrow(error);
		});
	});

	describe('updateUser', () => {
		it('should update user data successfully', async () => {
			const updatedUserData = { ...mockUser, display_name: 'Novo Nome' };
			jest.spyOn(apiClientService, 'patch').mockResolvedValue(updatedUserData);

			const updatedUser = await repository.updateUser({ display_name: 'Novo Nome' });

			expect(updatedUser).toBeInstanceOf(User);
			expect(updatedUser.display_name).toBe('Novo Nome');
		});

		it('should throw an error when update fails', async () => {
			const error = new Error('Failed to update user');
			jest.spyOn(apiClientService, 'patch').mockRejectedValue(error);

			await expect(repository.updateUser({ display_name: 'Novo Nome' })).rejects.toThrow('Failed to update user');
		});
	});

	describe('deleteUser', () => {
		it('should delete user successfully', async () => {
			jest.spyOn(apiClientService, 'delete').mockResolvedValue({ success: true });

			const result = await repository.deleteUser();

			expect(result).toBe(true);
		});

		it('should throw an error when delete fails', async () => {
			const error = new Error('Failed to delete user');
			jest.spyOn(apiClientService, 'delete').mockRejectedValue(error);

			await expect(repository.deleteUser()).rejects.toThrow('Failed to delete user');
		});
	});

	describe('create', () => {
		it('should create a new User instance', () => {
			const userData = { display_name: 'Test User', primary_email: 'test@example.com' };

			const user = repository.create(userData);

			expect(user).toBeInstanceOf(User);
			expect(user.display_name).toBe(userData.display_name);
			expect(user.primary_email).toBe(userData.primary_email);
		});
	});
});
