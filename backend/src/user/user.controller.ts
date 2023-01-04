import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { InsertResult, QueryFailedError, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from '../auth/auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
	) {}

	@Post()
	async create(@Body() registerUserDto: RegisterUserDto) {
		if (registerUserDto.password !== registerUserDto.password_confirm) {
			throw new BadRequestException('Passwords do not match');
		}
		const hashed = await bcrypt.hash(registerUserDto.password, 11);
		const createUserDto: CreateUserDto = {
			name: registerUserDto.name,
			password: hashed,
			is_intra: false,
		};
		try {
			const newUser: InsertResult = await this.userService.create(
				createUserDto,
			);
			return newUser;
		} catch (e) {
			console.log('Error on creating user', { e });
			throw new BadRequestException('Username should be unique');
		}
	}

	@UseGuards(AuthGuard)
	@Get()
	async findAll(): Promise<User[]> {
		return this.userService.findAll();
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	async findOne(@Param('id') id: number): Promise<User> {
		return this.userService.findOne({
			where: {
				id: +id,
			},
		});
	}

	@UseGuards(AuthGuard)
	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateAnimalDto: UpdateUserDto,
	): Promise<UpdateResult> {
		try {
			const updateResult = await this.userService.update(id, updateAnimalDto);
			return updateResult;
		} catch (e) {
			console.log({ e });
			if (e instanceof QueryFailedError) {
				throw new BadRequestException('Username should be unique 1');
			} else {
				throw new BadRequestException('Username should be unique 2');
			}
		}
	}
}
