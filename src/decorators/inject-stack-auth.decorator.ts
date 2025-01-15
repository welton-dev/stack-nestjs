import { Inject } from '@nestjs/common';
import { STACK_AUTH_SERVICE } from '../provider.declarations';

export function InjectStackAuthRepository(path?: string) {
	if (!path) return Inject(STACK_AUTH_SERVICE);

	const [type, service] = path.split('.');
	if (!service) return Inject(`${STACK_AUTH_SERVICE}.${type}`);

	return Inject(`${STACK_AUTH_SERVICE}.${type}.${service}`);
}
