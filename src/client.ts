import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { STACK_AUTH_LOGGER } from './provider.declarations';

@Injectable()
export class ApiClientService implements OnModuleInit {
	constructor(
		public readonly httpService: HttpService,
		@Inject(STACK_AUTH_LOGGER) private readonly logger: Logger,
	) {}

	async onModuleInit() {
		this.logger.log('API Client initialized');
	}

	async request<T>(config: AxiosRequestConfig): Promise<T> {
		const { data, status } = await firstValueFrom(
			this.httpService.request<T>({ ...config, validateStatus: (status) => status < 500, withCredentials: true }),
		);

		this.logger.log(`Requisição realizada: ${config.method} ${config.url}`);
		this.logger.log(`Status da requisição: ${status}`);

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
