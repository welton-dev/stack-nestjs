import { Test, TestingModule } from '@nestjs/testing';
import { UsersClientService } from '../../../repositories/client/users.client.service';

describe('UsersClientService', () => {
	let service: UsersClientService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersClientService],
		}).compile();

		service = module.get<UsersClientService>(UsersClientService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('findAll', () => {
		it('should return empty array', async () => {
			const result = await service.findAll();
			expect(result).toEqual([]);
		});
	});

	describe('findOne', () => {
		it('should return object with id', async () => {
			const id = '123';
			const result = await service.findOne(id);
			expect(result).toEqual({ id });
		});
	});
});
