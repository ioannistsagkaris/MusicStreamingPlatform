import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MinLength,
} from 'class-validator';

export class SignUpDto {
	@IsEmail({}, { message: '*Please provide a valid email address!' })
	@IsNotEmpty({ message: '*Email is required!' })
	email: string;

	@IsOptional()
	@IsString()
	username?: string;

	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
		message:
			'*Password must contain at least one uppercase letter, one lowercase letter, and one number!',
	})
	@MinLength(8, { message: '*Password must be at least 8 characters long!' })
	@IsString()
	@IsNotEmpty({ message: '*Password is required!' })
	password: string;
}

export class SignInDto {
	@IsString()
	email: string;

	@IsString()
	password: string;
}
