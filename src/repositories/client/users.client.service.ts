import { Injectable } from '@nestjs/common';
import { StackAuthService } from '../../decorators/stack-auth-service.decorator';

@Injectable()
@StackAuthService({ type: 'client', name: 'users' })
export class UsersClientService {
	constructor() {}
	async findAll() {
		// implementação
		return [];
	}

	async findOne(id: string) {
		// implementação
		return { id };
	}
}
