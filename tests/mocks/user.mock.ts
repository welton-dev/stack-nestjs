import { SuccessResponse } from '../../interfaces/success-response.interface';
import { IUser } from '../../interfaces/user.interface';
import { ITeam } from '../../interfaces/team.interface';

export const mockUser: IUser = {
	id: '123',
	primary_email_verified: true,
	primary_email_auth_enabled: true,
	signed_up_at_millis: Date.now() - 86400000,
	last_active_at_millis: Date.now(),
	primary_email: 'user@example.com',
	display_name: 'Test User',
	selected_team: {
		created_at_millis: 1630000000000,
		id: 'team123',
		name: 'test-team',
		display_name: 'Test Team',
		server_metadata: {
			key: 'value',
		},
		profile_image_url: 'https://example.com/image.jpg',
		client_metadata: {
			key: 'value',
		},
		client_read_only_metadata: {
			key: 'value',
		},
	} as ITeam,
	selected_team_id: 'team123',
	profile_image_url: 'https://example.com/profile.jpg',
	client_metadata: {
		theme: 'dark',
		language: 'pt-BR',
	},
	client_read_only_metadata: {
		lastLogin: Date.now(),
	},
	server_metadata: {
		role: 'user',
	},
};

export const mockSuccessResponse: SuccessResponse = {
	success: true,
};
