import { ObjectMap } from './object-map.interface';

export interface ITeam {
	id: string;
	name: string;
	display_name: string;
	created_at_millis: number;
	server_metadata: ObjectMap | null;
	profile_image_url: string | null;
	client_metadata: ObjectMap | null;
	client_read_only_metadata: ObjectMap | null;
}
