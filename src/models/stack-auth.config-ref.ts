import { StackAuthModuleOptions } from '../interfaces/stackauth-module-option';

export class StackAuthConfigRef {
	get valueOf(): StackAuthModuleOptions {
		return this.value;
	}

	constructor(private readonly value: StackAuthModuleOptions) {}

	setAuthToken(accessToken: string): this {
		this.value.stackAuth.baseURL = accessToken;

		return this;
	}
}
