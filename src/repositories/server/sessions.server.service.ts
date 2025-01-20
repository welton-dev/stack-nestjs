import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from '../../services/api-client.service';
import { STACK_AUTH_LOGGER } from '../../provider.declarations';
import { IToken } from '../../interfaces/token.interface';
import { StackAuthService } from '../../decorators/stack-auth-service.decorator';

@Injectable()
@StackAuthService({ type: 'server', name: 'sessions' })
export class SessionsServerService {
    constructor(
        private readonly apiClient: ApiClientService,
        @Inject(STACK_AUTH_LOGGER) private readonly logger: Logger,
    ) {}

    create(userId: string, expires_in_millis?: number): Promise<IToken> {
        return this.apiClient.post('/sessions', { user_id: userId, expires_in_millis });
    }

    signOut(token: string): Promise<void> {
        return this.apiClient.delete(`/sessions/current`, { headers: { 'x-stack-refresh-token': token } });
    }

    refresh(token: string): Promise<{ access_token: string }> {
        return this.apiClient.post('/sessions/current/refresh', { headers: { 'x-stack-refresh-token': token } });
    }
}
