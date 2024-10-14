import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SongService } from './song.service';
@Controller('song')
export class SongController {
	constructor(private songService: SongService) {}

	@Get('getSongs')
	async printSongs() {
		try {
			return await this.songService.printSongs();
		} catch (error) {
			throw new BadRequestException('*Failed to retrieve songs!');
		}
	}

	@Get('getSearchSongs')
	async printSearchSongs(@Query('query') query: string) {
		try {
			return await this.songService.printSearchSongs(query);
		} catch (error) {
			throw new BadRequestException('*Failed to retrieve search songs!');
		}
	}

	@Get('getGenreSongs')
	async printGenreSongs(@Query('query') query: string) {
		try {
			return await this.songService.printGenreSongs(query);
		} catch (error) {
			throw new BadRequestException('*Failed to retrieve genre songs!');
		}
	}
}
