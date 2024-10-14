import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto, SignUpDto, TokenDto, UpdateDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import * as argon from 'argon2';

describe('AuthController', () => {
	let controller: AuthController;

	const mockPrismaService = {
		user: {
			create: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	const mockAuthService = {
		signup: jest.fn(async (dto: SignUpDto) => {
			(argon as any).hash = jest.fn().mockResolvedValue(dto.password);

			if (dto.email === 'Ioannis@gmail.com') {
				throw new BadRequestException('Email is already signed in!');
			}

			if (dto.email === 'invalidEmail') {
				throw new BadRequestException('Other error!');
			}

			mockPrismaService.user.create.mockResolvedValue({
				id: '1',
				email: dto.email,
				username: dto.username,
				hash: '$argon2id$v=19$m=65536,t=3,p=4$COaT0vbhjCETwq8/b503Kg$OSIxLiy4PHDmK2DIwBS/4lZ+qN1StQHAq7v9K7j4ijE',
				createAt: '2024-03-16T18:10:21.828Z',
				role: 'FREE',
			});

			return { accessToken: 'mockedToken' };
		}),

		signin: jest.fn(async (dto: SignInDto) => {
			const user = mockPrismaService.user.findUnique.mockResolvedValue({
				where: {
					email: dto.email,
				},
			});

			(argon as any).verify = jest.fn().mockResolvedValue(dto.password);

			if (!user || dto.email === 'invalidEmail') {
				throw new BadRequestException('Incorrect email or password!');
			}

			return { accessToken: 'mockedToken' };
		}),

		update: jest.fn(async (dto: UpdateDto) => {
			const mockUser = {
				id: '1',
				email: 'Ioannis@gmail.com',
				username: 'Ioannis',
				hash: '$argon2id$v=19$m=65536,t=3,p=4$COaT0vbhjCETwq8/b503Kg$OSIxLiy4PHDmK2DIwBS/4lZ+qN1StQHAq7v9K7j4ijE',
				createAt: '2024-03-16T18:10:21.828Z',
				role: 'FREE',
			};

			const user = mockPrismaService.user.findUnique.mockResolvedValue({
				where: {
					email: mockUser.email,
				},
			});

			if (!user || dto.newEmail === 'invalidEmail') {
				throw new BadRequestException('There was an error!');
			}

			mockPrismaService.user.update.mockResolvedValue({
				where: {
					email: mockUser.email,
				},
				data: {
					email: dto.newEmail,
					username: dto.newUsername,
					hash: ((argon as any).hash = jest
						.fn()
						.mockResolvedValue(dto.newPassword)),
				},
			});

			return { accessToken: 'mockedToken' };
		}),

		delete: jest.fn(async (dto: TokenDto) => {
			const mockUser = {
				id: '1',
				email: 'Ioannis@gmail.com',
				username: 'Ioannis',
				hash: '$argon2id$v=19$m=65536,t=3,p=4$COaT0vbhjCETwq8/b503Kg$OSIxLiy4PHDmK2DIwBS/4lZ+qN1StQHAq7v9K7j4ijE',
				createAt: '2024-03-16T18:10:21.828Z',
				role: 'FREE',
			};

			const user = mockPrismaService.user.delete.mockResolvedValue({
				where: {
					id: mockUser.id,
				},
			});

			if (!user || dto.token === 'invalidToken') {
				throw new BadRequestException('There was an error!');
			}

			return { message: 'Account deleted' };
		}),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{ provide: AuthService, useValue: mockAuthService },
				{ provide: PrismaService, useValue: mockPrismaService },
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should signup', async () => {
		const dto: SignUpDto = {
			email: 'IoannisNew@gmail.com',
			username: 'IoannisNew',
			password: 'Ioannis7',
		};

		const response = await controller.signup(dto);
		expect(response).toEqual({ accessToken: 'mockedToken' });
		expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
	});

	it('should throw PrismaClientKnownRequestError if email is already registered', async () => {
		const dto: SignUpDto = {
			email: 'Ioannis@gmail.com',
			username: 'Ioannis',
			password: 'Ioannis7',
		};

		await expect(controller.signup(dto)).rejects.toThrow(BadRequestException);
	});

	it('should throw BadRequestException for other errors', async () => {
		const dto: SignUpDto = {
			email: 'invalidEmail',
			username: 'InvalidUser',
			password: 'InvalidUser123',
		};

		await expect(controller.signup(dto)).rejects.toThrow(BadRequestException);
	});

	it('should signin', async () => {
		const dto: SignInDto = {
			email: 'Ioannis@gmail.com',
			password: 'Ioannis7',
		};

		const response = await controller.signin(dto);
		expect(response).toEqual({ accessToken: 'mockedToken' });
		expect(mockAuthService.signin).toHaveBeenCalledWith(dto);
	});

	it('should throw BadRequestException for incorrect credentials', async () => {
		const dto: SignInDto = {
			email: 'invalidEmail',
			password: 'InvalidUser123',
		};

		await expect(controller.signin(dto)).rejects.toThrow(BadRequestException);
	});

	it('should update', async () => {
		const dto: UpdateDto = {
			newEmail: 'IoannisUpdate@gmail.com',
			newUsername: 'IoannisUpdate',
			newPassword: 'Ioannis7',
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMjA1Yzc5LTM5MDAtNDI3OC1hMzk2LWMzOWVlNjJiZmU1NyIsImVtYWlsIjoiSW9hbm5pc0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6IklvYW5uaXMiLCJoYXNoIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTMscD00JENPYVQwdmJoakNFVHdxOC9iNTAzS2ckT1NJeExpeTRQSERtSzJESXdCUy80bForcU4xU3RRSEFxN3Y5SzdqNGlqRSIsImNyZWF0ZWRBdCI6IjIwMjQtMDMtMTZUMTg6MTA6MjEuODI4WiIsInJvbGUiOiJQUkVNSVVNIiwiaWF0IjoxNzEwNjc3ODA3LCJleHAiOjE3MTA2ODUwMDd9.D0NtBxxdtY1aYZducH6nedcTAMGRstnClwCilepAXdM',
		};

		const response = await controller.update(dto);
		expect(response).toEqual({ accessToken: 'mockedToken' });
		expect(mockAuthService.update).toHaveBeenCalledWith(dto);
	});

	it('should throw BadRequestException for other errors', async () => {
		const dto: UpdateDto = {
			newEmail: 'invalidEmail',
			newUsername: 'invalidUser',
			newPassword: 'InvalidUser123',
			token: 'invalidToken',
		};

		await expect(controller.update(dto)).rejects.toThrow(BadRequestException);
	});

	it('should delete', async () => {
		const dto: TokenDto = {
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMjA1Yzc5LTM5MDAtNDI3OC1hMzk2LWMzOWVlNjJiZmU1NyIsImVtYWlsIjoiSW9hbm5pc0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6IklvYW5uaXMiLCJoYXNoIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTMscD00JENPYVQwdmJoakNFVHdxOC9iNTAzS2ckT1NJeExpeTRQSERtSzJESXdCUy80bForcU4xU3RRSEFxN3Y5SzdqNGlqRSIsImNyZWF0ZWRBdCI6IjIwMjQtMDMtMTZUMTg6MTA6MjEuODI4WiIsInJvbGUiOiJQUkVNSVVNIiwiaWF0IjoxNzEwNjc3ODA3LCJleHAiOjE3MTA2ODUwMDd9.D0NtBxxdtY1aYZducH6nedcTAMGRstnClwCilepAXdM',
		};

		const response = await controller.delete(dto);
		expect(response).toEqual({ message: 'Account deleted' });
		expect(mockAuthService.delete).toHaveBeenCalledWith(dto);
	});

	it('should throw BadRequestException for other errors', async () => {
		const dto: TokenDto = {
			token: 'invalidToken',
		};

		await expect(controller.delete(dto)).rejects.toThrow(BadRequestException);
	});
});
