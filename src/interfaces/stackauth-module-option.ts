import { HttpModuleOptions } from '@nestjs/axios';
import { Abstract, Logger, ModuleMetadata, Type } from '@nestjs/common';
import { StackAuthConfig } from './stack-auth-config.interface';

export type { StackAuthConfig };

export enum StackAuthAccessTypes {
	CLIENT = 'client',
	SERVER = 'server',
}

export interface StackAuthModuleOptions extends HttpModuleOptions {
	accessType: StackAuthAccessTypes;
	stackAuth: StackAuthConfig;
	logger?: Logger;
	global?: boolean;
}

export interface StackAuthOptionsFactory {
	createStackAuthOptions(): Promise<StackAuthModuleOptions> | StackAuthModuleOptions;
}

export interface StackAuthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
	// eslint-disable-next-line
	inject?: Array<string | symbol | Type | Abstract<any> | Function>;
	useClass?: Type<StackAuthOptionsFactory>;
	useExisting?: Type<StackAuthOptionsFactory>;
	useFactory?: (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...args: any[]
	) => Promise<Omit<StackAuthModuleOptions, 'global'>> | Omit<StackAuthModuleOptions, 'global'>;
	global?: boolean;
}
