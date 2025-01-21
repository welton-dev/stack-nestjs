import { StackAuthOptions } from '../interfaces/stack-auth-options';

export class StackAuthConfigRef {
    get valueOf(): StackAuthOptions {
        return this.value;
    }

    constructor(private readonly value: StackAuthOptions) {}

    setAuthToken(accessToken: string): this {
        this.value.baseURL = accessToken;

        return this;
    }
}
