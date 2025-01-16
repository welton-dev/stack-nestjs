import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	displayName?: string;

	@Field({ nullable: true })
	primaryEmail?: string;
}
