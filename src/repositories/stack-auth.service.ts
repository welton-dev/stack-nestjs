import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { STACK_AUTH_SERVICE_METADATA, StackAuthServiceMetadata } from '../decorators/stack-auth-service.decorator';
import { StackAuthClientServices, StackAuthServerServices } from '../interfaces/stack-auth-services.interface';

@Injectable()
export class StackAuthService implements OnModuleInit {
    public readonly client: StackAuthClientServices = {} as StackAuthClientServices;
    public readonly server: StackAuthServerServices = {} as StackAuthServerServices;

    public constructor(
        @Inject(forwardRef(() => DiscoveryService))
        private readonly discoveryService: DiscoveryService,
        private readonly reflector: Reflector,
    ) {}

    async onModuleInit() {
        const providers = this.discoveryService.getProviders();

        providers.forEach((wrapper) => {
            if (!wrapper.instance || !wrapper.metatype) return;

            const metadata = this.reflector.get<StackAuthServiceMetadata>(STACK_AUTH_SERVICE_METADATA, wrapper.metatype);

            if (metadata) {
                if (metadata.type === 'client') {
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.client as any)[metadata.name] = wrapper.instance;
                } else {
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this.server as any)[metadata.name] = wrapper.instance;
                }
            }
        });
    }
}
