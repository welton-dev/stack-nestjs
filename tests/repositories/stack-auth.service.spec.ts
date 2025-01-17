import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { StackAuthService } from '../../src/repositories/stack-auth.service';
import { createMock } from '@golevelup/ts-jest';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

describe('StackAuthService', () => {
	let service: StackAuthService;
	let discoveryService: jest.Mocked<DiscoveryService>;
	let reflector: jest.Mocked<Reflector>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StackAuthService,
				{
					provide: DiscoveryService,
					useValue: createMock<DiscoveryService>(),
				},
				{
					provide: Reflector,
					useValue: createMock<Reflector>(),
				},
			],
		}).compile();

		service = module.get<StackAuthService>(StackAuthService);
		discoveryService = module.get(DiscoveryService);
		reflector = module.get(Reflector);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('onModuleInit', () => {
		it('should initialize client services', async () => {
			const mockClientInstance = { method: () => 'client' };
			const mockClientMetadata = { type: 'client' as const, name: 'test' };

			const mockWrapper = createMock<InstanceWrapper>({
				instance: mockClientInstance,
				name: ['TestService'],
				token: 'TestService',
				id: '1',
			});

			discoveryService.getProviders.mockReturnValue([mockWrapper]);
			reflector.get.mockReturnValue(mockClientMetadata);

			await service.onModuleInit();

			expect((service.client as any)[mockClientMetadata.name]).toBe(mockClientInstance);
		});

		it('should initialize server services', async () => {
			const mockServerInstance = { method: () => 'server' };
			const mockServerMetadata = { type: 'server' as const, name: 'test' };

			const mockWrapper = createMock<InstanceWrapper>({
				instance: mockServerInstance,
				name: ['TestService'],
				token: 'TestService',
				id: '1',
			});

			discoveryService.getProviders.mockReturnValue([mockWrapper]);
			reflector.get.mockReturnValue(mockServerMetadata);

			await service.onModuleInit();

			expect((service.server as any)[mockServerMetadata.name]).toBe(mockServerInstance);
		});

		it('should undefined if the provider is not found', async () => {
			const mockServerMetadata = { type: 'server' as const, name: 'test' };

			const mockWrapper = createMock<InstanceWrapper>({
				instance: undefined,
			});

			discoveryService.getProviders.mockReturnValue([mockWrapper]);
			reflector.get.mockReturnValue(mockServerMetadata);

			await service.onModuleInit();

			expect((service.server as any)[mockServerMetadata.name]).toBe(undefined);
		});

		it('should skip services without metadata', async () => {
			const mockInstance = { method: () => 'test' };

			const mockWrapper = createMock<InstanceWrapper>({
				instance: mockInstance,
				metatype: class TestService {},
				name: ['TestService'],
				token: 'TestService',
				isAlias: false,
			});

			discoveryService.getProviders.mockReturnValue([mockWrapper]);
			reflector.get.mockReturnValue(undefined);

			await service.onModuleInit();

			expect(service.client).toEqual({});
			expect(service.server).toEqual({});
		});
	});
});
