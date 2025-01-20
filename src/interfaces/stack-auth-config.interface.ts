export enum StackAuthAccessTypes {
    CLIENT = 'client',
    SERVER = 'server',
}

export interface StackAuthConfig {
    projectId: string;
    accessType: StackAuthAccessTypes;
    accessToken?: string;
    refreshToken?: string;
    publishableClientKey?: string;
    secretServerKey?: string;
    superSecretAdminKey?: string;
}

export interface StackAuthHeaders {
    'X-Stack-Project-Id': string;
    'X-Stack-Access-Type': string;
    'X-Stack-Access-Token'?: string;
    'X-Stack-Refresh-Token'?: string;
    'X-Stack-Publishable-Client-Key'?: string;
    'X-Stack-Secret-Server-Key'?: string;
    'X-Stack-Super-Secret-Admin-Key'?: string;
}
