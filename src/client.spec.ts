import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ApiClientService } from './client';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosResponse, AxiosRequestHeaders } from 'axios';
import { STACK_AUTH_LOGGER } from './provider.declarations';
import { of } from 'rxjs';

describe('ApiClientService', () => {
	let service: ApiClientService;
	let httpService: HttpService;
	let _logger: Logger;

	const mockAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
		data,
		status: 200,
		statusText: 'OK',
		headers: {} as AxiosRequestHeaders,
		config: {
			headers: {} as AxiosRequestHeaders,
		},
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ApiClientService,
				{
					provide: HttpService,
					useValue: createMock<HttpService>(),
				},
				{
					provide: STACK_AUTH_LOGGER,
					useValue: createMock<Logger>(),
				},
			],
		}).compile();

		service = module.get<ApiClientService>(ApiClientService);
		httpService = module.get<HttpService>(HttpService);
		_logger = module.get<Logger>(STACK_AUTH_LOGGER);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('request configuration', () => {
		it('should make request with correct config', async () => {
			const mockData = { success: true };
			const requestConfig = { url: '/test', method: 'GET' };

			jest.spyOn(httpService, 'request').mockReturnValue(of(mockAxiosResponse(mockData)));

			await service.request(requestConfig);

			expect(httpService.request).toHaveBeenCalledWith(requestConfig);
		});
	});

	describe('HTTP methods', () => {
		const mockData = { success: true };
		const testUrl = '/test';

		beforeEach(() => {
			jest.spyOn(httpService, 'request').mockReturnValue(of(mockAxiosResponse(mockData)));
		});

		it('should make GET request', async () => {
			const result = await service.get(testUrl);
			expect(result).toEqual(mockData);
			expect(httpService.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: testUrl,
				}),
			);
		});

		it('should make POST request', async () => {
			const postData = { test: true };
			const result = await service.post(testUrl, postData);
			expect(result).toEqual(mockData);
			expect(httpService.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: testUrl,
					data: postData,
				}),
			);
		});

		it('should make PUT request', async () => {
			const putData = { test: true };
			const result = await service.put(testUrl, putData);
			expect(result).toEqual(mockData);
			expect(httpService.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'PUT',
					url: testUrl,
					data: putData,
				}),
			);
		});

		it('should make PATCH request', async () => {
			const patchData = { test: true };
			const result = await service.patch(testUrl, patchData);
			expect(result).toEqual(mockData);
			expect(httpService.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'PATCH',
					url: testUrl,
					data: patchData,
				}),
			);
		});

		it('should make DELETE request', async () => {
			const result = await service.delete(testUrl);
			expect(result).toEqual(mockData);
			expect(httpService.request).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'DELETE',
					url: testUrl,
				}),
			);
		});
	});
});
