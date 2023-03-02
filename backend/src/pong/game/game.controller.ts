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

@UseGuards(AuthGuard())
@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post()
	async create(@Body() createGameDto: CreateGameDto) {
		await this.gameService.checkInitOrThrow(createGameDto);
		try {
			const newGame: Game = await this.gameService.save(createGameDto);

			return newGame;
		} catch (e) {
			throw new BadRequestException("user doesn't exist");
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
