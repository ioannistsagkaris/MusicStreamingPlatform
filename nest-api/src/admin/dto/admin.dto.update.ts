import { IsOptional, IsString } from 'class-validator';

export class AdminDtoUpdateSong {
	@IsString()
	songName: string;

	@IsString()
	songGenre: string;

	@IsString()
	songFile: string;

	@IsOptional()
	@IsString()
	songNameNew?: string;

	@IsOptional()
	@IsString()
	songGenreNew?: string;

	@IsOptional()
	@IsString()
	songFileNew?: string;
}

export class AdminDtoUpdateArtist {
	@IsString()
	artistName: string;

	@IsString()
	artistImage: string;

	@IsOptional()
	@IsString()
	artistNameNew?: string;

	@IsOptional()
	@IsString()
	artistImageNew?: string;
}

export class AdminDtoUpdateAlbum {
	@IsString()
	albumName: string;

	@IsString()
	albumImage: string;

	@IsOptional()
	@IsString()
	albumNameNew?: string;

	@IsOptional()
	@IsString()
	albumImageNew?: string;
}
