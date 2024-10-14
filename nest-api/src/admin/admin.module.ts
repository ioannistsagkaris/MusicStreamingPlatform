import { Module } from '@nestjs/common';

import { AdminController } from './admin.controller';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { SongService } from 'src/song/song.service';

@Module({
	controllers: [AdminController],
	providers: [ArtistService, AlbumService, SongService],
})
export class AdminModule {}
