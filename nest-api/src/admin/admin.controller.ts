import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Post,
} from '@nestjs/common';

import {
	AdminDtoAdd,
	AdminDtoDelete,
	AdminDtoUpdateAlbum,
	AdminDtoUpdateArtist,
	AdminDtoUpdateSong,
} from './dto';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { SongService } from 'src/song/song.service';

@Controller('admin')
export class AdminController {
	constructor(
		private artistService: ArtistService,
		private albumService: AlbumService,
		private songService: SongService,
	) {}

	@Post('add')
	async add(@Body() dto: AdminDtoAdd) {
		try {
			const artistMessage = await this.artistService.addArtist(
				dto.artistName,
				dto.artistImage,
			);
			const albumMessage = await this.albumService.addAlbum(
				dto.albumName,
				dto.artistName,
				dto?.albumImage,
			);
			const songMessage = await this.songService.addSong(
				dto.songName,
				dto.songGenre,
				dto.songFile,
				dto.artistName,
				dto.albumName,
			);

			return { artistMessage, albumMessage, songMessage };
		} catch (error) {
			throw new BadRequestException(error.response.message);
		}
	}

	@Post('delete')
	async delete(@Body() dto: AdminDtoDelete) {
		try {
			const songMessage = await this.songService.deleteSong(dto);
			const albumMessage = await this.albumService.deleteAlbum(dto);
			const artistMessage = await this.artistService.deleteArtist(dto);

			return { songMessage, albumMessage, artistMessage };
		} catch (error) {
			throw new BadRequestException(error.response.message);
		}
	}

	@Post('updateSong')
	async updateSong(@Body() dto: AdminDtoUpdateSong) {
		try {
			const songMessage = await this.songService.updateSong(dto);

			return { songMessage };
		} catch (error) {
			throw new BadRequestException(error.response.message);
		}
	}

	@Post('updateArtist')
	async updateArtist(@Body() dto: AdminDtoUpdateArtist) {
		try {
			const artistMessage = await this.artistService.updateArtist(dto);

			return { artistMessage };
		} catch (error) {
			throw new BadRequestException(error.response.message);
		}
	}

	@Post('updateAlbum')
	async updateAlbum(@Body() dto: AdminDtoUpdateAlbum) {
		try {
			const albumMessage = await this.albumService.updateAlbum(dto);

			return { albumMessage };
		} catch (error) {
			throw new BadRequestException(error.response.message);
		}
	}
}
