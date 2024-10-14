import { IsString } from 'class-validator';

export class SongDto {
	@IsString()
	token?: string;

	@IsString()
	idSong?: string;
}
