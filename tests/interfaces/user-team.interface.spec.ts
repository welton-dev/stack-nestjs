import { IUser, IUserCreate, IUserUpdate, IUserQueryParams } from '../../src/interfaces/user.interface';
import { ITeam, ITeamCreate, ITeamUpdate } from '../../src/interfaces/team.interface';
import { ObjectMap } from '../../src/interfaces/object-map.interface';

describe('User and Team Interfaces', () => {
	describe('IUser', () => {
		it('should validate a complete user object', () => {
			const user: IUser = {
				id: '123',
				primary_email_verified: true,
				primary_email_auth_enabled: false,
				signed_up_at_millis: Date.now(),
				last_active_at_millis: Date.now(),
				primary_email: 'test@example.com',
				display_name: 'Test User',
				selected_team: null,
				selected_team_id: null,
				profile_image_url: 'https://example.com/image.jpg',
				client_metadata: { key: 'value' },
				client_read_only_metadata: null,
				server_metadata: null,
			};

			expect(user.id).toBeDefined();
			expect(typeof user.primary_email_verified).toBe('boolean');
		});

		it('should validate user create object', () => {
			const createUser: IUserCreate = {
				primary_email: 'test@example.com',
				display_name: 'Test User',
			};

			expect(createUser.primary_email).toBeDefined();
			expect(createUser.display_name).toBeDefined();
		});

		it('should validate user update object', () => {
			const updateUser: IUserUpdate = {
				display_name: 'Updated Name',
				client_metadata: { key: 'new value' },
			};

			expect('id' in updateUser).toBeFalsy();
		});

		it('should validate user query params', () => {
			const params: IUserQueryParams = {
				team_id: '123',
				limit: 10,
				cursor: 'abc',
				order_by: 'display_name',
				desc: true,
				query: 'search',
			};

			expect(params.order_by).toMatch(/^(signed_up_at|display_name|primary_email)$/);
		});
	});

	describe('ITeam', () => {
		it('should validate a complete team object', () => {
			const team: ITeam = {
				id: '123',
				name: 'test-team',
				display_name: 'Test Team',
				created_at_millis: Date.now(),
				server_metadata: null,
				profile_image_url: 'https://example.com/team.jpg',
				client_metadata: { key: 'value' },
				client_read_only_metadata: null,
			};

			expect(team.id).toBeDefined();
			expect(typeof team.name).toBe('string');
		});

		it('should validate team create object', () => {
			const createTeam: ITeamCreate = {
				name: 'test-team',
				display_name: 'Test Team',
			};

			expect(createTeam.name).toBeDefined();
			expect(createTeam.display_name).toBeDefined();
		});

		it('should validate team update object', () => {
			const updateTeam: ITeamUpdate = {
				display_name: 'Updated Team',
				client_metadata: { key: 'new value' },
			};

			expect(updateTeam.name).toBeUndefined();
		});
	});

	describe('ObjectMap', () => {
		it('should validate object map', () => {
			const map: ObjectMap = {
				string: 'value',
				number: 123,
				boolean: true,
				object: { nested: 'value' },
				array: [1, 2, 3],
			};

			expect(typeof map).toBe('object');
			expect(Array.isArray(map)).toBeFalsy();
		});
	});
});
