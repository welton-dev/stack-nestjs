import { ExecutionContext, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { loadModule } from '../helpers/load-module';
import { StackAuthContextType } from '../types';

@Injectable({ scope: Scope.REQUEST })
export class StackAuthRequestResolver {
	constructor(@Inject(REQUEST) private readonly request: Request) {}

	resolve<T>(context: ExecutionContext): T {
		const contextType: StackAuthContextType = context.getType();

		switch (contextType) {
			case 'http':
				return context.switchToHttp().getRequest();

			case 'graphql':
				return loadModule('@nestjs/graphql', true).GqlExecutionContext.create(context).getContext().req?.socket?._httpMessage?.req;
			default:
				throw new Error(`Unsupported request type '${contextType}'.`);
		}
	}

	getRequest(): Request {
		return this.request;
	}

	getHeaders(): Record<string, string> {
		return this.request.headers as unknown as Record<string, string>;
	}

	getAccessToken(): string {
		return this.getHeaders()['authorization']?.split(' ')[1] as string;
	}
}
