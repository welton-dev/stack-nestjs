import { HttpModuleOptions } from '@nestjs/axios';
import { Abstract, Logger, ModuleMetadata, Type } from '@nestjs/common';
import { StackAuthConfig } from './stack-auth-config.interface';

export type { StackAuthConfig };

export enum LogLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

export interface StackAuthOptions extends HttpModuleOptions {
    stackAuth: StackAuthConfig;
    logger?: Logger | LogLevel | boolean;
    global?: boolean;
}

export interface StackAuthOptionsFactory {
    createStackAuthOptions(): Promise<StackAuthOptions> | StackAuthOptions;
}

export interface StackAuthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    // eslint-disable-next-line
    inject?: Array<string | symbol | Type | Abstract<any> | Function>;
    useClass?: Type<StackAuthOptionsFactory>;
    useExisting?: Type<StackAuthOptionsFactory>;
    useFactory?: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
    ) => Promise<Omit<StackAuthOptions, 'global'>> | Omit<StackAuthOptions, 'global'>;
    global?: boolean;
}
