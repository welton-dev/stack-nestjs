import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiClientService } from '../../../services/api-client.service';
import { SessionsServerService } from '../../../repositories/server/sessions.server.service';
import { STACK_AUTH_LOGGER } from '../../../provider.declarations';
import { createMock } from '@golevelup/ts-jest';

describe('SessionsServerService', () => {
	let service: SessionsServerService;
	let apiClient: jest.Mocked<ApiClientService>;
	let logger: jest.Mocked<Logger>;

	const mockToken = {
		access_token: 'access-token-123',
		refresh_token: 'refresh-token-123',
		expires_in: 3600,
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SessionsServerService,
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

		service = module.get<SessionsServerService>(SessionsServerService);
		apiClient = module.get(ApiClientService);
		logger = module.get(STACK_AUTH_LOGGER);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('create', () => {
		it('should create a new session', async () => {
			apiClient.post.mockResolvedValue(mockToken);

			const userId = 'user-123';
			const expiresInMillis = 3600000;

			const result = await service.create(userId, expiresInMillis);

			expect(result).toEqual(mockToken);
			expect(apiClient.post).toHaveBeenCalledWith('/sessions', {
				user_id: userId,
				expires_in_millis: expiresInMillis,
			});
		});

		it('should create a session without expiration', async () => {
			apiClient.post.mockResolvedValue(mockToken);

			const userId = 'user-123';

			const result = await service.create(userId);

			expect(result).toEqual(mockToken);
			expect(apiClient.post).toHaveBeenCalledWith('/sessions', {
				user_id: userId,
				expires_in_millis: undefined,
			});
		});
	});

	describe('signOut', () => {
		it('should sign out current session', async () => {
			apiClient.delete.mockResolvedValue(undefined);

			const token = 'refresh-token-123';

			await service.signOut(token);

			expect(apiClient.delete).toHaveBeenCalledWith('/sessions/current', {
				headers: { 'x-stack-refresh-token': token },
			});
		});
	});

	describe('refresh', () => {
		it('should refresh access token', async () => {
			const mockResponse = { access_token: 'new-access-token-123' };
			apiClient.post.mockResolvedValue(mockResponse);

			const token = 'refresh-token-123';

			const result = await service.refresh(token);

			expect(result).toEqual(mockResponse);
			expect(apiClient.post).toHaveBeenCalledWith('/sessions/current/refresh', {
				headers: { 'x-stack-refresh-token': token },
			});
		});
	});
});
