import { IsNotEmpty, IsString } from 'class-validator';

export class AdminDtoDelete {
	@IsString()
	@IsNotEmpty()
	songName: string;

	@IsString()
	@IsNotEmpty()
	albumName: string;

	@IsString()
	@IsNotEmpty()
	artistName: string;
}
