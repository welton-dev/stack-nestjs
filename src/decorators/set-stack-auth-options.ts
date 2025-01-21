import { SetMetadata } from '@nestjs/common';
import { StackAuthDecoratorOptions } from '../interfaces/stack-auth-decorator-options';
import { STACK_AUTH_OPTIONS } from '../provider.declarations';

export function SetStackAuthOptions(options?: StackAuthDecoratorOptions): MethodDecorator & ClassDecorator {
    return SetMetadata(STACK_AUTH_OPTIONS, options);
}
