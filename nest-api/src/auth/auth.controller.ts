import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	Post,
	Query,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateDto, SignInDto, SignUpDto, TokenDto, SongDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	async signup(@Body(new ValidationPipe()) dto: SignUpDto) {
		try {
			return await this.authService.signup(dto);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
				throw new ForbiddenException('*Email is already signed in!');
			} else {
				throw new BadRequestException(error.response.message);
			}
		}
	}

	@Post('signin')
	async signin(@Body(new ValidationPipe()) dto: SignInDto) {
		try {
			return await this.authService.signin(dto);
		} catch (error) {
			throw new BadRequestException('*Incorrect email or password!');
		}
	}

	@Post('role')
	async role(@Body(new ValidationPipe()) dto: TokenDto) {
		try {
			return await this.authService.role(dto);
		} catch (error) {
			throw new BadRequestException('*Failed to change status role!');
		}
	}

	@Post('update')
	async update(@Body(new ValidationPipe()) dto: UpdateDto) {
		try {
			return await this.authService.update(dto);
		} catch (error) {
			throw new BadRequestException(error.response.message);
		}
	}

	@Post('delete')
	async delete(@Body(new ValidationPipe()) dto: TokenDto) {
		try {
			return await this.authService.delete(dto);
		} catch (error) {
			throw new BadRequestException('*Failed to delete user!');
		}
	}

	@Post('addLike')
	async addLikedSong(@Body(new ValidationPipe()) dto: SongDto) {
		try {
			return await this.authService.addLikedSong(dto);
		} catch (error) {
			throw new BadRequestException('*Failed to add liked song!');
		}
	}

	@Post('removeLike')
	async removeLikedSong(@Body(new ValidationPipe()) dto: SongDto) {
		try {
			return await this.authService.removeLikedSong(dto);
		} catch (error) {
			throw new BadRequestException('*Failed to remove liked song!');
		}
	}

	@Get('getLikedSongs')
	async printLikedSongs(@Query('query') query: string) {
		try {
			return await this.authService.printLikedSongs(query);
		} catch (error) {
			throw new BadRequestException('*Failed to retrieve liked songs!');
		}
	}
}
