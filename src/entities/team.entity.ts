import { ApiClientService } from '../client';
import { type ObjectMap } from '../interfaces/object-map.interface';
import { ITeam } from '../interfaces/team.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('Team')
export class Team {
	@Field()
	id: string;
	@Field()
	name: string;
	@Field()
	display_name: string;
	@Field()
	created_at_millis: number;
	@Field(() => Object, { nullable: true })
	server_metadata: ObjectMap | null;
	@Field({ nullable: true })
	profile_image_url: string | null;
	@Field(() => Object, { nullable: true })
	client_metadata: ObjectMap | null;
	@Field(() => Object, { nullable: true })
	client_read_only_metadata: ObjectMap | null;

	private apiClient: ApiClientService;

	constructor(data: Partial<ITeam>) {
		Object.assign(this, data);
	}

	public setApiClient(apiClient: ApiClientService): void {
		this.apiClient = apiClient;
	}

	// Métodos auxiliares
	createdAt(): Date {
		return new Date(this.created_at_millis);
	}

	getServerMetadata<T>(key: string): T | null {
		return (this.server_metadata?.[key] as T) || null;
	}

	getClientMetadata<T>(key: string): T | null {
		return (this.client_metadata?.[key] as T) || null;
	}

	getReadOnlyMetadata<T>(key: string): T | null {
		return (this.client_read_only_metadata?.[key] as T) || null;
	}

	setClientMetadata(key: string, value: unknown): void {
		if (!this.client_metadata) {
			this.client_metadata = {};
		}
		this.client_metadata[key] = value;
	}
}
