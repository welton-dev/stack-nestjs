import { Field, ObjectType } from '@nestjs/graphql';
import { ApiClientService } from '../client';
import { ObjectMap } from '../interfaces/object-map.interface';
import { SuccessResponse } from '../interfaces/success-response.interface';
import { Team } from './team.entity';

@ObjectType('User')
export class User {
	@Field()
	readonly id: string;

	@Field()
	primary_email_verified: boolean;

	@Field()
	primary_email_auth_enabled: boolean;

	@Field()
	signed_up_at_millis: number;

	@Field()
	last_active_at_millis: number;

	@Field({ nullable: true })
	primary_email: string | null;

	@Field({ nullable: true })
	display_name: string | null;

	@Field(() => Team, { nullable: true })
	selected_team: Team | null;

	@Field({ nullable: true })
	selected_team_id: string | null;

	@Field({ nullable: true })
	profile_image_url: string | null;

	@Field(() => Object, { nullable: true })
	client_metadata: ObjectMap | null;

	@Field(() => Object, { nullable: true })
	client_read_only_metadata: ObjectMap | null;

	@Field(() => Object, { nullable: true })
	server_metadata: ObjectMap | null;

	private apiClient: ApiClientService;

	constructor(data: Partial<User>) {
		Object.assign(this, data);
	}

	public setApiClient(apiClient: ApiClientService): void {
		this.apiClient = apiClient;
	}

	public async delete(): Promise<boolean> {
		const response = await this.apiClient.delete<SuccessResponse>('/me');
		return response.success;
	}

	public async update(data: Partial<User>): Promise<User> {
		const response = await this.apiClient.patch<User>('/me', data);
		return new User(response);
	}
}
