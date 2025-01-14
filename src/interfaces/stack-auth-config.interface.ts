export interface StackAuthConfig {
	baseURL: string;
	projectId: string;
	publishableClientKey?: string;
	secretServerKey?: string;
}

export interface StackAuthHeaders {
	'X-Stack-Access-Type': string;
	'X-Stack-Project-Id': string;
	'X-Stack-Publishable-Client-Key'?: string;
	'X-Stack-Secret-Server-Key'?: string;
	'X-Stack-Access-Token'?: string;
}
