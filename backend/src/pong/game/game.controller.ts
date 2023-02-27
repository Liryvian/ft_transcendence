import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	BadRequestException,
	UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';
import { AuthGuard } from '../../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post()
	async create(@Body() createGameDto: CreateGameDto) {
		try {
			const currentGames: Game[] = await this.gameService.findAll({
				relations: { player_one: true, player_two: true },
			});
			currentGames.forEach((item, index) => {
				console.log(currentGames, index);
			});
			console.log('curren games', currentGames[0]);
			const newGame: Game = await this.gameService.save(createGameDto);
			return newGame;
		} catch (e) {
			throw new BadRequestException('game can not be created');
		}
	}

	@Get()
	findAll() {
		return this.gameService.findAll({
			relations: { player_one: true, player_two: true },
		});
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.gameService.findOne({
			where: { id },
			relations: { player_one: true, player_two: true },
		});
	}

	@Patch(':id')
	update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto) {
		return this.gameService.update(id, updateGameDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.gameService.remove(id);
	}
}
