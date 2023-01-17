import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	UploadedFile,
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
import fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Post()
	async create(@Body() registerUserDto: RegisterUserDto) {
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
			throw new BadRequestException('Please pick a different username');
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
	async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		try {
			const updateResult: UpdateResult = await this.userService.update(
				id,
				updateUserDto,
			);
			return updateResult;
		} catch (e) {
			if (e instanceof QueryFailedError) {
				throw new BadRequestException('Please pick a different username');
			}
			if (e instanceof NotFoundException) {
				throw e;
			}
			console.log('An unknown error occurred, please check!', { e });
			throw new BadRequestException(
				'Something went wrong on updating the user',
			);
		}
	}

	@Post(':id/avatar')
	@UseInterceptors(FileInterceptor('file'))
	async setAvatar(
		@Param('id') id: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 100000 }),
					new FileTypeValidator({ fileType: /jpg|png/i }),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		console.log(file);
	}
}
