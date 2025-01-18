import { ObjectMap } from './object-map.interface';
import { ITeam } from './team.interface';
import { SuccessResponse } from './success-response.interface';

export interface IUser {
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
}

export type IUserUpdate = Partial<Omit<IUser, 'id' | 'created_at' | 'updated_at'>>;

export interface IUserResponse extends SuccessResponse {
	user: IUser;
}

export interface IUserCreate {
	primary_email: string;
	display_name: string;
}

export interface IUserQueryParams {
	team_id?: string;
	limit?: number;
	cursor?: string;
	order_by?: 'signed_up_at' | 'display_name' | 'primary_email';
	desc?: boolean;
	query?: string;
}

export interface IUserListResponse extends SuccessResponse {
	users: IUser[];
	next_cursor?: string;
	total?: number;
}
