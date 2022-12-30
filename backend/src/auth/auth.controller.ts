import {
	NotFoundException,
	BadRequestException,
	Body,
	Controller,
	Post,
	Res,
	Get,
	Req,
	UseGuards,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private authService: AuthService,
	) {}

	@Post('register')
	async register(@Body() body: RegisterDto) {
		if (body.password !== body.password_confirm) {
			throw new BadRequestException('Passwords do not match!');
		}
		const hashed = await bcrypt.hash(body.password, 11);
		try {
			const newUser = this.userService.create({
				is_intra: false,
				name: body.name,
				password: hashed,
			});
			return newUser;
		} catch (e) {
			throw new BadRequestException('Username should be unique');
		}
	}

	@Post('login')
	async login(
		@Body('name') name: string,
		@Body('password') password: string,
		@Res({ passthrough: true }) response: Response,
	) {
		const user = await this.userService.findOne({
			where: {
				name: name,
			},
		});
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new BadRequestException('Invalid user/password combination');
		}
		// signAsync can throw, but only in a few very specific cases where invalid options are send
		// since we are only sending a plain object and no options we can "safely" ignore to add try/catch
		const jwt = await this.jwtService.signAsync({ id: user.id });
		response.cookie('jwt', jwt, { httpOnly: true });
		return user;
	}

	@UseGuards(AuthGuard)
	@Post('logout')
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('jwt');
		return {
			message: 'Success',
		};
	}

	@UseGuards(AuthGuard)
	@Get('user')
	async user(@Req() request: Request) {
		const id = await this.authService.userId(request);
		return this.userService.findOne({
			where: {
				id: id,
			},
		});
	}
}
