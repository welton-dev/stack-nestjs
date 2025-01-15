import { Provider, Type } from '@nestjs/common';
import { STACK_AUTH_SERVICE } from '../provider.declarations';
import { STACK_AUTH_SERVICE_METADATA, StackAuthServiceMetadata } from '../decorators/stack-auth-service.decorator';

export class ServiceDiscoveryHelper {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static discoverServices(services: Type<any>[]): Provider[] {
		const providers: Provider[] = [];

		for (const service of services) {
			const metadata: StackAuthServiceMetadata = Reflect.getMetadata(STACK_AUTH_SERVICE_METADATA, service);

			if (metadata) {
				// Registra o serviço como provider
				providers.push(service);

				// Registra o provider específico
				providers.push({
					provide: `${STACK_AUTH_SERVICE}.${metadata.type}.${metadata.name}`,
					useClass: service,
				});
			}
		}

		return providers;
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static getServiceTokens(services: Type<any>[]): string[] {
		const tokens: string[] = [];

		for (const service of services) {
			const metadata: StackAuthServiceMetadata = Reflect.getMetadata(STACK_AUTH_SERVICE_METADATA, service);

			if (metadata) {
				tokens.push(`${STACK_AUTH_SERVICE}.${metadata.type}.${metadata.name}`);
			}
		}

		return tokens;
	}
}
