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
	Res,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { GamesHistory, User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { InsertResult, QueryFailedError, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRelationsBodyDto } from './dto/user-relations-body.dto';
import { UserRelationsQueryDto } from './dto/user-relations-query.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { Game, gameStates } from '../../pong/game/entities/game.entity';
import { GameService } from '../../pong/game/game.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {
	constructor(
		private userService: UserService,
		private gameService: GameService,
	) {}

	private readonly defaultRelationships = {
		relationshipSource: true,
		relationshipTarget: true,
		achievements: true,
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

	@UseGuards(AuthGuard())
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

	@UseGuards(AuthGuard())
	@Get('without_game')
	async findUserWithoutGame() {
		const usersWithGames = await this.userService.findAll({
			relations: {
				games_as_player_one: true,
				games_as_player_two: true,
			},
		});
		// filter out users with active games
		const usersWithoutActiveGames = usersWithGames.filter((user) => {
			if (user.games_as_player_one.find((game) => game.state === 'active')) {
				return false;
			}
			if (user.games_as_player_two.find((game) => game.state === 'active')) {
				return false;
			}
			return true;
		});
		return usersWithoutActiveGames;
	}

	@UseGuards(AuthGuard())
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

	@UseGuards(AuthGuard())
	@Patch(':id')
	async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
		try {
			if (updateUserDto.hasOwnProperty('password')) {
				const user = await this.userService.findOne({ where: { id: id } });
				if (!(await bcrypt.compare(updateUserDto.password, user.password))) {
					throw new BadRequestException('Invalid current password');
				}
				const hashed = await bcrypt.hash(updateUserDto.new_password, 11);
				const updateResult: UpdateResult = await this.userService.update(id, {
					password: hashed,
					name: updateUserDto.name,
				});
				return updateResult;
			}
			if (updateUserDto.hasOwnProperty('name')) {
				const updateResult: UpdateResult = await this.userService.update(id, {
					name: updateUserDto.name,
				});
				return updateResult;
			}
		} catch (e) {
			if (e instanceof QueryFailedError) {
				throw new BadRequestException('Please pick a different username');
			}
			if (e instanceof NotFoundException) {
				throw e;
			}
			if (e instanceof BadRequestException) {
				throw e;
			}
			console.log('An unknown error occurred, please check!', { e });
			throw new BadRequestException(
				'Something went wrong on updating the user',
			);
		}
	}

	@UseGuards(AuthGuard())
	@Post(':id/avatar')
	@UseInterceptors(FileInterceptor('avatar'))
	async setAvatar(
		@Param('id') id: number,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1000000 }),
					new FileTypeValidator({ fileType: /(jpeg|jpg|png|gif)$/i }),
				],
			}),
		)
		avatar: Express.Multer.File,
		@Res() response: Response,
	) {
		console.log('here?');
		await this.userService
			.findOne({ where: { id: id } })
			.then(async (user: User) => {
				user.avatar = avatar.filename;
				const upd = await this.userService.update(user.id, user);
				return user;
			});
		return response.redirect('/settings');
	}

	@UseGuards(AuthGuard())
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

	@UseGuards(AuthGuard())
	@Get(':id/games-history')
	async getGamesHistory(@Param('id') id: number) {
		let gamesHistory: GamesHistory = { wins: 0, losses: 0 };
		try {
			const user: User = await this.userService.findOne({
				where: { id },
				relations: {
					games_as_player_one: true,
					games_as_player_two: true,
				},
			});
			user.games.forEach((game: Game) => {
				if (
					game.player_one.id === user.id &&
					game.score_player_one > game.score_player_two &&
					game.state === gameStates.DONE
				) {
					++gamesHistory.wins;
				} else if (
					game.player_two.id === user.id &&
					game.score_player_two > game.score_player_one &&
					game.state === gameStates.DONE
				) {
					++gamesHistory.wins;
				} else {
					++gamesHistory.losses;
				}
			});
			return gamesHistory;
		} catch (e) {
			return gamesHistory;
		}
	}
}
