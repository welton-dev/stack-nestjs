import { SetMetadata } from '@nestjs/common';

export const STACK_AUTH_SERVICE_METADATA = 'stack_auth_service';

export interface StackAuthServiceMetadata {
    type: 'client' | 'server';
    name: string;
}

export const StackAuthService = (metadata: StackAuthServiceMetadata) => SetMetadata(STACK_AUTH_SERVICE_METADATA, metadata);
