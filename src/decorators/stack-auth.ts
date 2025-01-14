import { applyDecorators, UseGuards } from '@nestjs/common';
import { StackAuthDecoratorOptions } from '../interfaces/stack-auth-decorator-options';
import { SetStackAuthOptions } from './set-stack-auth-options';
import { StackAuthGuard } from '../guards/stach-auth.guard';

export function StackAuth(options?: StackAuthDecoratorOptions): MethodDecorator & ClassDecorator {
	return applyDecorators(SetStackAuthOptions(options), UseGuards(StackAuthGuard));
}
