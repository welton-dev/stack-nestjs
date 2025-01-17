import { AxiosResponse } from 'axios';

export function mockAxiosResponse<T>(data: T): AxiosResponse<T> {
	return {
		data,
		status: 200,
		statusText: 'OK',
		headers: {},
		//eslint-disable-next-line @typescript-eslint/no-explicit-any
		config: {} as any,
	};
}

export function mockAxiosResponseError<T>(data: T): AxiosResponse<T> {
	return {
		data,
		status: 500,
		statusText: 'Internal Server Error',
		headers: {},
		//eslint-disable-next-line @typescript-eslint/no-explicit-any
		config: {} as any,
	};
}
