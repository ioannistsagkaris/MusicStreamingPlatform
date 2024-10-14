import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MinLength,
	ValidateIf,
} from 'class-validator';

export class UpdateDto {
	@IsOptional()
	@IsEmail({}, { message: 'Invalid email address or it is already signed in!' })
	@ValidateIf(o => o.newEmail !== '')
	newEmail?: string;

	@IsOptional()
	@IsString()
	newUsername?: string;

	@IsOptional()
	@Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
		message:
			'Password must contain at least one uppercase letter, one lowercase letter, and one number!',
	})
	@MinLength(8, { message: 'Password must be at least 8 characters long!' })
	@IsString()
	@ValidateIf(o => o.newPassword !== '')
	newPassword?: string;

	@IsString()
	token?: string;
}
