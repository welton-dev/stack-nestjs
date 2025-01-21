import { UsersClientService } from '../repositories/client/users.client.service';
import { UsersServerService } from '../repositories/server/users.server.service';

export interface StackAuthClientServices {
    users: UsersClientService;
}

export interface StackAuthServerServices {
    users: UsersServerService;
}

export interface StackAuthServices {
    client: StackAuthClientServices;
    server: StackAuthServerServices;
}
