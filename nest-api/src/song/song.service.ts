import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminDtoDelete, AdminDtoUpdateSong } from 'src/admin/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SongService {
	constructor(private prisma: PrismaService) {}

	async addSong(
		name: string,
		genre: string,
		track: string,
		artistName: string,
		albumName: string,
	) {
		try {
			const resultArtist = await this.prisma
				.$queryRaw`SELECT id FROM "Artist" WHERE name = ${artistName};`;
			const idArtist: string = await resultArtist[0].id;

			const resultAlbum = await this.prisma
				.$queryRaw`SELECT id FROM "Album" WHERE (name = ${albumName} AND "artistId" = ${idArtist});`;
			const idAlbum: string = await resultAlbum[0].id;

			const songExists = await this.prisma.song.findFirst({
				where: {
					artistId: idArtist,
					albumId: idAlbum,
					name: name,
				},
			});

			if (songExists === null) {
				await this.prisma.song.create({
					data: {
						name: name,
						genre: genre,
						track: track,
						artists: {
							connect: { id: idArtist },
						},
						albums: {
							connect: { id: idAlbum },
						},
					},
				});

				return { message: 'Song has been created!' };
			}

			return { message: 'Song already exists!' };
		} catch (error) {
			throw new BadRequestException('Failed to add song!');
		}
	}

	async deleteSong(dto: AdminDtoDelete) {
		try {
			const song = await this.prisma.song.findFirst({
				where: {
					name: dto.songName,
					albums: {
						name: dto.albumName,
					},
					artists: {
						name: dto.artistName,
					},
				},
			});

			const id: string = song.id;

			await this.prisma.song.delete({
				where: {
					id: id,
				},
			});

			return { message: 'Song has been deleted!' };
		} catch (error) {
			throw new BadRequestException('Failed to delete song!');
		}
	}

	async updateSong(dto: AdminDtoUpdateSong) {
		try {
			const newName = dto.songNameNew !== '' ? dto.songNameNew : dto.songName;

			const newGenre = dto.songGenreNew !== '' ? dto.songGenreNew : dto.songGenre;

			const newFile = dto.songFileNew !== '' ? dto.songFileNew : dto.songFile;

			await this.prisma.song.update({
				where: {
					name: dto.songName,
					genre: dto.songGenre,
					track: dto.songFile,
				},
				data: {
					name: newName,
					genre: newGenre,
					track: newFile,
				},
			});

			return { message: 'Song has been updated!' };
		} catch (error) {
			throw new BadRequestException('Failed to update song!');
		}
	}

	async printSongs() {
		try {
			const resultSong = await this.prisma.song.findMany({
				select: {
					id: true,
					name: true,
					track: true,
					albums: { select: { name: true, image: true } },
					artists: { select: { name: true, image: true } },
				},
			});

			const shuffledResultSong = resultSong.sort(() => Math.random() - 0.5);

			return shuffledResultSong;
		} catch (error) {
			throw new BadRequestException('Failed to get songs!');
		}
	}

	async printSearchSongs(query: string) {
		try {
			const resultSong = await this.prisma.song.findMany({
				where: {
					OR: [
						{ name: { contains: query, mode: 'insensitive' } },
						// { albums: { name: { contains: query, mode: 'insensitive' } } },
						{ artists: { name: { contains: query, mode: 'insensitive' } } },
					],
				},
				select: {
					id: true,
					name: true,
					track: true,
					albums: { select: { name: true, image: true } },
					artists: { select: { name: true, image: true } },
				},
			});

			return resultSong;
		} catch (error) {
			throw new BadRequestException('Failed to get search songs!');
		}
	}

	async printGenreSongs(query: string) {
		try {
			if (query !== 'Rap') {
				const resultSong = await this.prisma.song.findMany({
					where: {
						genre: query,
					},
					select: {
						id: true,
						name: true,
						track: true,
						albums: { select: { name: true, image: true } },
						artists: { select: { name: true, image: true } },
					},
				});

				const shuffledResultSong = resultSong.sort(() => Math.random() - 0.5);

				return shuffledResultSong;
			} else if (query === 'Rap') {
				const resultSong = await this.prisma.song.findMany({
					where: {
						genre: query || 'Hip-Hop',
					},
					select: {
						id: true,
						name: true,
						track: true,
						albums: { select: { name: true, image: true } },
						artists: { select: { name: true, image: true } },
					},
				});

				const shuffledResultSong = resultSong.sort(() => Math.random() - 0.5);

				return shuffledResultSong;
			}
		} catch (error) {
			throw new BadRequestException('Failed to get genre songs!');
		}
	}
}
