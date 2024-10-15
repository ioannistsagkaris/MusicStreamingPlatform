import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDto, SignInDto, SignUpDto, TokenDto, SongDto } from './dto';
import { Role } from '@prisma/client';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	async signup(dto: SignUpDto) {
		try {
			const hash = await argon.hash(dto.password);

			const username = dto.username !== '' ? dto.username : 'user';

			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					username,
					hash,
				},
			});

			return this.signToken(
				user.id,
				user.email,
				user.username,
				user.hash,
				user.createAt,
				user.role,
			);
		} catch (error) {
			throw error;
		}
	}

	async signin(dto: SignInDto) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					email: dto.email,
				},
			});
			if (!user) {
				throw new BadRequestException();
			}

			const passwordMatch = await argon.verify(user.hash, dto.password);
			if (!passwordMatch) {
				throw new BadRequestException();
			}

			return this.signToken(
				user.id,
				user.email,
				user.username,
				user.hash,
				user.createAt,
				user.role,
			);
		} catch (error) {
			throw error;
		}
	}

	async role(dto: TokenDto) {
		try {
			const decodedToken = await this.jwt.decode(dto.token);
			let changeRole: Role;

			if (decodedToken.role === 'FREE') {
				changeRole = Role.PREMIUM;
			} else if (decodedToken.role === 'PREMIUM') {
				changeRole = Role.FREE;
			}

			const user = await this.prisma.user.update({
				where: {
					id: decodedToken.id,
				},
				data: {
					role: changeRole,
				},
			});

			return this.signToken(
				user.id,
				user.email,
				user.username,
				user.hash,
				user.createAt,
				user.role,
			);
		} catch (error) {
			throw new BadRequestException();
		}
	}

	async update(dto: UpdateDto) {
		try {
			const decodedToken = await this.jwt.decode(dto.token);

			const user = await this.prisma.user.findUnique({
				where: {
					id: decodedToken.id,
				},
			});

			const newEmail = dto.newEmail !== '' ? dto.newEmail : user.email;

			const newUsername =
				dto.newUsername !== '' ? dto.newUsername : user.username;

			const newPassword = dto.newPassword !== '' ? dto.newPassword : user.hash;

			const hash =
				newPassword !== user.hash ? await argon.hash(newPassword) : user.hash;

			await this.prisma.user.update({
				where: {
					id: decodedToken.id,
				},
				data: {
					email: newEmail,
					username: newUsername,
					hash,
				},
			});

			const updatedUser = await this.prisma.user.findUnique({
				where: {
					id: decodedToken.id,
				},
			});

			return this.signToken(
				updatedUser.id,
				updatedUser.email,
				updatedUser.username,
				updatedUser.hash,
				updatedUser.createAt,
				updatedUser.role,
			);
		} catch (error) {
			throw error;
		}
	}

	async delete(dto: TokenDto) {
		try {
			const decodedToken = await this.jwt.decode(dto.token);

			await this.prisma.user.delete({
				where: {
					id: decodedToken.id,
				},
			});

			return { message: 'Your account has been deleted successfully!' };
		} catch (error) {
			throw error;
		}
	}

	async addLikedSong(dto: SongDto) {
		try {
			const decodedToken = await this.jwt.decode(dto.token);

			await this.prisma.user.update({
				where: {
					id: decodedToken.id,
				},
				data: {
					playlist: {
						connect: { id: dto.idSong },
					},
				},
			});
		} catch (error) {
			throw new BadRequestException('Failed to add liked song!');
		}
	}

	async removeLikedSong(dto: SongDto) {
		try {
			const decodedToken = await this.jwt.decode(dto.token);

			await this.prisma.user.update({
				where: {
					id: decodedToken.id,
				},
				data: {
					playlist: {
						disconnect: { id: dto.idSong },
					},
				},
			});
		} catch (error) {
			throw new BadRequestException('Failed to add liked song!');
		}
	}

	async printLikedSongs(query: string) {
		try {
			const decodedToken = await this.jwt.decode(query);

			const resultSong = await this.prisma.song.findMany({
				where: {
					users: {
						some: {
							id: decodedToken.id,
						},
					},
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
			throw new BadRequestException('Failed to get liked songs!');
		}
	}

	async signToken(
		id: string,
		email: string,
		username: string,
		hash: string,
		createAt: Date,
		role: Role,
	): Promise<{ accessToken: string }> {
		const payload = {
			id,
			email,
			username,
			hash,
			createAt,
			role,
		};

		const token = await this.jwt.signAsync(payload, {
			expiresIn: '120m',
			secret: this.config.get<string>('JWT_SECRET'),
		});

		return {
			accessToken: token,
		};
	}
}
