import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto, SignUpDto, TokenDto, UpdateDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthService', () => {
	let service: AuthService;

	const mockPrismaService = {
		user: {
			create: jest.fn(),
			findUnique: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	};

	const mockJwtService = {
		decode: jest.fn(),
		signAsync: jest.fn(),
	};

	const mockConfigService = {
		get: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create user and return access token', async () => {
		const dto: SignUpDto = {
			email: 'IoannisNew@gmail.com',
			username: 'IoannisNew',
			password: 'Ioannis7',
		};

		const mockUser = {
			id: '40205c79-3900-4278-a396-c39ee62bfe57',
			email: dto.email,
			username: dto.username,
			hash: '$argon2id$v=19$m=65536,t=3,p=4$COaT0vbhjCETwq8/b503Kg$OSIxLiy4PHDmK2DIwBS/4lZ+qN1StQHAq7v9K7j4ijE',
			createAt: '2024-03-16T18:10:21.828Z',
			role: 'FREE',
		};

		const mockToken = 'mockAccessToken';

		mockPrismaService.user.create.mockResolvedValue(mockUser);
		mockJwtService.signAsync.mockResolvedValue({ accessToken: mockToken });
		mockConfigService.get.mockReturnValue('mockJwtSecret');

		const result = await service.signup(dto);

		expect(result.accessToken).toEqual({ accessToken: mockToken });
		expect(mockPrismaService.user.create).toHaveBeenCalledWith({
			data: {
				email: dto.email,
				username: dto.username,
				hash: expect.any(String),
			},
		});
		expect(mockJwtService.signAsync).toHaveBeenCalledWith(
			{
				id: mockUser.id,
				email: mockUser.email,
				username: mockUser.username,
				hash: mockUser.hash,
				createAt: mockUser.createAt,
				role: mockUser.role,
			},
			{
				expiresIn: '120m',
				secret: 'mockJwtSecret',
			},
		);
		expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
	});

	it('should read user and return access token', async () => {
		const dto: SignInDto = {
			email: 'Ioannis@gmail.com',
			password: 'Ioannis7',
		};

		const mockUser = {
			id: '40205c79-3900-4278-a396-c39ee62bfe57',
			email: dto.email,
			username: 'Ioannis',
			hash: '$argon2id$v=19$m=65536,t=3,p=4$COaT0vbhjCETwq8/b503Kg$OSIxLiy4PHDmK2DIwBS/4lZ+qN1StQHAq7v9K7j4ijE',
			createAt: '2024-03-16T18:10:21.828Z',
			role: 'FREE',
		};

		const mockToken = 'mockAccessToken';

		mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
		mockJwtService.signAsync.mockResolvedValue({ accessToken: mockToken });
		mockConfigService.get.mockReturnValue('mockJwtSecret');

		const result = await service.signin(dto);

		expect(result.accessToken).toEqual({ accessToken: mockToken });
		expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
			where: {
				email: dto.email,
			},
		});
		expect(mockJwtService.signAsync).toHaveBeenCalledWith(
			{
				id: mockUser.id,
				email: mockUser.email,
				username: mockUser.username,
				hash: mockUser.hash,
				createAt: mockUser.createAt,
				role: mockUser.role,
			},
			{
				expiresIn: '120m',
				secret: 'mockJwtSecret',
			},
		);
		expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
	});

	it('should update user and return access token', async () => {
		const dto: UpdateDto = {
			newEmail: 'IoannisNew@gmail.com',
			newUsername: 'IoannisNew',
			newPassword: 'Ioannis7',
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMjA1Yzc5LTM5MDAtNDI3OC1hMzk2LWMzOWVlNjJiZmU1NyIsImVtYWlsIjoiSW9hbm5pc0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6IklvYW5uaXMiLCJoYXNoIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTMscD00JENPYVQwdmJoakNFVHdxOC9iNTAzS2ckT1NJeExpeTRQSERtSzJESXdCUy80bForcU4xU3RRSEFxN3Y5SzdqNGlqRSIsImNyZWF0ZWRBdCI6IjIwMjQtMDMtMTZUMTg6MTA6MjEuODI4WiIsInJvbGUiOiJQUkVNSVVNIiwiaWF0IjoxNzEwNjc3ODA3LCJleHAiOjE3MTA2ODUwMDd9.D0NtBxxdtY1aYZducH6nedcTAMGRstnClwCilepAXdM',
		};

		const mockUser = {
			id: '40205c79-3900-4278-a396-c39ee62bfe57',
			email: 'Ioannis@gmail.com',
			username: 'Ioannis',
			hash: '$argon2id$v=19$m=65536,t=3,p=4$COaT0vbhjCETwq8/b503Kg$OSIxLiy4PHDmK2DIwBS/4lZ+qN1StQHAq7v9K7j4ijE',
			createAt: '2024-03-16T18:10:21.828Z',
			role: 'FREE',
		};

		const mockToken = 'mockAccessToken';

		mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
		mockPrismaService.user.update.mockResolvedValue(mockUser);
		mockJwtService.signAsync.mockResolvedValue({ accessToken: mockToken });
		mockConfigService.get.mockReturnValue('mockJwtSecret');
		mockJwtService.decode.mockResolvedValue(mockUser);

		const result = await service.update(dto);

		expect(result.accessToken).toEqual({ accessToken: mockToken });
		expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
			where: {
				id: mockUser.id,
			},
		});
		expect(mockPrismaService.user.update).toHaveBeenCalledWith({
			where: {
				id: mockUser.id,
			},
			data: {
				email: dto.newEmail,
				username: dto.newUsername,
				hash: expect.any(String),
			},
		});
		expect(mockJwtService.signAsync).toHaveBeenCalledWith(
			{
				id: mockUser.id,
				email: mockUser.email,
				username: mockUser.username,
				hash: mockUser.hash,
				createAt: mockUser.createAt,
				role: mockUser.role,
			},
			{
				expiresIn: '120m',
				secret: 'mockJwtSecret',
			},
		);
		expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
		expect(mockJwtService.decode).toHaveBeenCalledWith(dto.token);
	});

	it('should delete user and return message', async () => {
		const dto: TokenDto = {
			token:
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQwMjA1Yzc5LTM5MDAtNDI3OC1hMzk2LWMzOWVlNjJiZmU1NyIsImVtYWlsIjoiSW9hbm5pc0BnbWFpbC5jb20iLCJ1c2VybmFtZSI6IklvYW5uaXMiLCJoYXNoIjoiJGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTMscD00JENPYVQwdmJoakNFVHdxOC9iNTAzS2ckT1NJeExpeTRQSERtSzJESXdCUy80bForcU4xU3RRSEFxN3Y5SzdqNGlqRSIsImNyZWF0ZWRBdCI6IjIwMjQtMDMtMTZUMTg6MTA6MjEuODI4WiIsInJvbGUiOiJQUkVNSVVNIiwiaWF0IjoxNzEwNjc3ODA3LCJleHAiOjE3MTA2ODUwMDd9.D0NtBxxdtY1aYZducH6nedcTAMGRstnClwCilepAXdM',
		};

		const mockUser = {
			id: '40205c79-3900-4278-a396-c39ee62bfe57',
			email: 'Ioannis@gmail.com',
			username: 'Ioannis',
			hash: '$argon2id$v=19$m=65536,t=3,p=4$COaT0vbhjCETwq8/b503Kg$OSIxLiy4PHDmK2DIwBS/4lZ+qN1StQHAq7v9K7j4ijE',
			createAt: '2024-03-16T18:10:21.828Z',
			role: 'FREE',
		};

		mockJwtService.decode.mockResolvedValue(mockUser);

		const result = await service.delete(dto);

		expect(result).toEqual({
			message: 'Your account has been deleted successfully!',
		});
		expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
			where: {
				id: mockUser.id,
			},
		});
		expect(mockJwtService.decode).toHaveBeenCalledWith(dto.token);
	});
});
