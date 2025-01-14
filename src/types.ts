import { ContextType } from '@nestjs/common';

// Interfaces para os tipos de dados retornados pela API
export interface ApiResponse<T> {
	data: T;
	status: number;
	message?: string;
}

// Interface para erros da API
export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
}

// Interface para paginação
export interface PaginatedResponse<T> extends ApiResponse<T> {
	meta: {
		total: number;
		page: number;
		limit: number;
		hasMore: boolean;
	};
}

// Interface para opções de requisição
export interface RequestOptions {
	retry?: number;
	timeout?: number;
	cache?: boolean;
	headers?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StackAuthResponseProvider = (req: any) => string | Promise<string>;

export type StackAuthContextType = ContextType | 'graphql';
