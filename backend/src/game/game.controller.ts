import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post()
	async create(@Body() data: CreateGameDto) {
		const newGame: Game = await this.gameService.create(data);
		console.log(newGame.player_one.name);
		return newGame;
		// return this.gameService.create(createGameDto);
	}

	@Get()
	findAll() {
		return this.gameService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.gameService.findOne({ id });
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
