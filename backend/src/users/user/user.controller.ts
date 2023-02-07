import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	MaxFileSizeValidator,
	NotFoundException,
	Param,
	ParseFilePipe,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { AuthGuard } from '../../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import {
	FindOptionsOrder,
	InsertResult,
	QueryFailedError,
	UpdateResult,
} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRelationsBodyDto } from './dto/user-relations-body.dto';
import { UserRelationsQueryDto } from './dto/user-relations-query.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	private readonly defaultRelationships = {};
	private readonly defaultOrder: FindOptionsOrder<User> = {
		name: 'ASC',
		in_chats: {
			created_at: 'ASC',
		},
	};

	@Post()
	async create(@Body() registerUserDto: RegisterUserDto) {
		const hashed = await bcrypt.hash(registerUserDto.password, 11);
		const createUserDto: CreateUserDto = {
			name: registerUserDto.name,
			password: hashed,
			is_intra: false,
		};

		try {
			const newUser: InsertResult = await this.userService.insert(
				createUserDto,
			);
			return newUser;
		} catch (e) {
			throw new BadRequestException('Please pick a different username');
		}
	}

	// @UseGuards(AuthGuard)
	@Get()
	async findAll(
		@Query() userRelationsQuery?: UserRelationsQueryDto,
		@Body() userRelationsBody?: UserRelationsBodyDto,
	): Promise<User[]> {
		const userRelationsDto = Object.keys(userRelationsBody ?? {}).length
			? userRelationsBody
			: Object.keys(userRelationsQuery ?? {}).length
			? userRelationsQuery
			: this.defaultRelationships;

		const users = this.userService.findAll({ relations: userRelationsDto });
		return users;
	}

	// @UseGuards(AuthGuard)
	@Get(':id')
	async findOne(
		@Param('id') id: number,
		@Query() userRelationsQuery?: UserRelationsQueryDto,
		@Body() userRelationsBody?: UserRelationsBodyDto,
	): Promise<User> {
		const userRelationsDto = Object.keys(userRelationsBody ?? {}).length
			? userRelationsBody
			: Object.keys(userRelationsQuery ?? {}).length
			? userRelationsQuery
			: this.defaultRelationships;

		return this.userService.findOne({
			where: {
				id: id,
			},
			relations: userRelationsDto,
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

	@UseGuards(AuthGuard)
	@Post(':id/avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	async setAvatar(
		@Param('id') id: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000000 }),
					new FileTypeValidator({ fileType: /jpg|png|octet-stream/i }),
				],
			}),
		)
		avatar: Express.Multer.File,
	) {
		return this.userService
			.findOne({ where: { id: id } })
			.then(async (user: User) => {
				user.avatar = avatar.filename;
				const upd = await this.userService.update(user.id, user);
				return user;
			});
	}

	@UseGuards(AuthGuard)
	@Delete(':id/avatar')
	async removeAvatar(@Param('id') id: number) {
		return this.userService
			.findOne({ where: { id: id } })
			.then(async (user: User) => {
				const upd = await this.userService.update(user.id, {
					...user,
					avatar: null,
				});
				return upd;
			});
	}
}
