import { Module } from '@nestjs/common';

import { AdminController } from 'src/admin/admin.controller';
import { AlbumService } from './album.service';
import { ArtistService } from 'src/artist/artist.service';
import { SongService } from 'src/song/song.service';

@Module({
	controllers: [AdminController],
	providers: [AlbumService, ArtistService, SongService],
})
export class AlbumModule {}
