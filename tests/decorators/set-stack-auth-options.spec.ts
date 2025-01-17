import { SetStackAuthOptions } from '../../src/decorators/set-stack-auth-options';
import { STACK_AUTH_OPTIONS } from '../../src/provider.declarations';
import { StackAuthDecoratorOptions } from '../../src/interfaces/stack-auth-decorator-options';
import { StackAuthResponseProvider } from '../../src/types';

describe('SetStackAuthOptions', () => {
	const mockResponseProvider: StackAuthResponseProvider = async () => 'token';

	it('should set metadata with provided options', () => {
		const options: StackAuthDecoratorOptions = {
			response: mockResponseProvider,
		};

		@SetStackAuthOptions(options)
		class TestClass {}

		const metadata = Reflect.getMetadata(STACK_AUTH_OPTIONS, TestClass);
		expect(metadata).toEqual(options);
	});

	it('should set metadata with undefined when no options provided', () => {
		@SetStackAuthOptions()
		class TestClass {}

		const metadata = Reflect.getMetadata(STACK_AUTH_OPTIONS, TestClass);
		expect(metadata).toBeUndefined();
	});

	it('should work as method decorator', () => {
		class TestClass {
			@SetStackAuthOptions({ response: mockResponseProvider })
			testMethod() {}
		}

		const metadata = Reflect.getMetadata(STACK_AUTH_OPTIONS, TestClass.prototype.testMethod);
		expect(metadata).toEqual({ response: mockResponseProvider });
	});
});
