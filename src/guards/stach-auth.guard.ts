import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LiteralObject } from '../interfaces/literal-object';
import { StackAuthRequestResolver } from '../services/request.resolver';

@Injectable()
export class StackAuthGuard implements CanActivate {
	constructor(private readonly requestResolver: StackAuthRequestResolver) {}

	canActivate(context: ExecutionContext): boolean {
		const request: LiteralObject = this.requestResolver.resolve(context);
		console.log(request);
		return true;
	}
}
