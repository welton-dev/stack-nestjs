import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { STACK_AUTH_LOGGER, STACK_AUTH_OPTIONS } from '../provider.declarations';
import { StackAuthOptions } from '../interfaces/stack-auth-options';

@Injectable()
export class ApiClientService {
    constructor(
        public readonly httpService: HttpService,
        @Inject(STACK_AUTH_LOGGER) private readonly logger: Logger,
        @Inject(STACK_AUTH_OPTIONS) private readonly options: StackAuthOptions,
    ) {}

    async request<T>(config: AxiosRequestConfig): Promise<T> {
        const { data, status } = await firstValueFrom(this.httpService.request<T>({ ...config }));

        this.logger.log(`Requisição realizada: ${config.method} ${config.url} Status: ${status}`);

        return data;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'GET', url, ...config });
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'POST', url, data, ...config });
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'PUT', url, data, ...config });
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'PATCH', url, data, ...config });
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ method: 'DELETE', url, ...config });
    }
}
