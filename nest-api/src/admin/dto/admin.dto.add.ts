import { IsNotEmpty, IsString } from 'class-validator';

export class AdminDtoAdd {
	@IsString()
	@IsNotEmpty()
	songName: string;

	@IsString()
	@IsNotEmpty()
	songGenre: string;

	@IsString()
	@IsNotEmpty()
	songFile: string;

	@IsString()
	@IsNotEmpty()
	artistName: string;

	@IsString()
	@IsNotEmpty()
	artistImage: string;

	@IsString()
	@IsNotEmpty()
	albumName: string;

	@IsString()
	@IsNotEmpty()
	albumImage: string;
}
