import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminDtoUpdateArtist } from 'src/admin/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
	constructor(private prisma: PrismaService) {}

	async addArtist(name: string, image: string) {
		try {
			const artistExists = await this.prisma.artist.findUnique({
				where: {
					name_image: {
						name: name,
						image: image,
					},
				},
			});

			if (!artistExists) {
				await this.prisma.artist.create({
					data: {
						name: name,
						image: image,
					},
				});

				return { message: 'Artist has been created!' };
			}

			return { message: 'Artist already exists!' };
		} catch (error) {
			throw new BadRequestException('Failed to add artist!');
		}
	}

	async updateArtist(dto: AdminDtoUpdateArtist) {
		try {
			const newName =
				dto.artistNameNew !== (undefined || '')
					? dto.artistNameNew
					: dto.artistName;

			const newImage =
				dto.artistImageNew !== (undefined || '')
					? dto.artistImageNew
					: dto.artistImage;

			await this.prisma.artist.update({
				where: {
					name_image: {
						name: dto.artistName,
						image: dto.artistImage,
					},
				},
				data: {
					name: newName,
					image: newImage,
				},
			});

			return { message: 'Artist has been updated!' };
		} catch (error) {
			throw new BadRequestException('Failed to update artist!');
		}
	}
}
