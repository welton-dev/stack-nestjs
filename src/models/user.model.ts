import { ObjectMap } from '../interfaces/object-map.interface';
import { SuccessResponse } from '../interfaces/success-response.interface';
import { ITeam } from '../interfaces/team.interface';
import { IUser, IUserUpdate } from '../interfaces/user.interface';
import { ApiClientService } from '../services/api-client.service';

export class User {
    readonly id: string;
    primary_email_verified: boolean;
    primary_email_auth_enabled: boolean;
    signed_up_at_millis: number;
    last_active_at_millis: number;
    primary_email: string | null;
    display_name: string | null;
    selected_team: ITeam | null;
    selected_team_id: string | null;
    profile_image_url: string | null;
    client_metadata: ObjectMap | null;
    client_read_only_metadata: ObjectMap | null;
    server_metadata: ObjectMap | null;
    private apiClient: ApiClientService;

    constructor(data: Partial<IUser>, apiClient?: ApiClientService) {
        if (apiClient) {
            this.setApiClient(apiClient);
        }
        Object.assign(this, data);
    }

    setApiClient(apiClient: ApiClientService): this {
        this.apiClient = apiClient;
        return this;
    }

    async delete(): Promise<boolean> {
        const response = await this.apiClient.delete<SuccessResponse>('/users/' + this.id);
        return response.success;
    }

    async update(data: IUserUpdate): Promise<User> {
        const response = await this.apiClient.patch<IUser>('/users/' + this.id, data);
        return new User(response);
    }

    async save(): Promise<User> {
        const response = await this.apiClient.patch<IUser>('/users/' + this.id, this);
        return new User(response);
    }

    toJSON(): IUser {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { apiClient, ...json } = this;
        return json;
    }
}
