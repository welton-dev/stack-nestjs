import { ObjectMap } from './object-map.interface';
import { ITeam } from './team.interface';

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
