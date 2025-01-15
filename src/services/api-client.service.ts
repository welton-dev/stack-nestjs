import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { STACK_AUTH_LOGGER, STACK_AUTH_OPTIONS } from '../provider.declarations';
import { StackAuthOptions } from '../interfaces/stack-auth-options';

@Injectable()
export class ApiClientService implements OnModuleInit {
	constructor(
		public readonly httpService: HttpService,
		@Inject(STACK_AUTH_LOGGER) private readonly logger: Logger,
		@Inject(STACK_AUTH_OPTIONS) private readonly options: StackAuthOptions,
	) {}

	async onModuleInit() {
		await this.logger.log('API Client initialized');
	}

	async request<T>(config: AxiosRequestConfig): Promise<T> {
		const { data, status } = await firstValueFrom(this.httpService.request<T>({ ...config }));

		this.logger.log(`Requisição realizada: ${config.method} ${config.url} Status: ${status}`);

		return data;
	}

	async get<T>(url: string): Promise<T> {
		return this.request<T>({ method: 'GET', url });
	}
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	async post<T>(url: string, data?: any): Promise<T> {
		return this.request<T>({ method: 'POST', url, data });
	}
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	async put<T>(url: string, data?: any): Promise<T> {
		return this.request<T>({ method: 'PUT', url, data });
	}
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	async patch<T>(url: string, data?: any): Promise<T> {
		return this.request<T>({ method: 'PATCH', url, data });
	}

	async delete<T>(url: string): Promise<T> {
		return this.request<T>({ method: 'DELETE', url });
	}
}
