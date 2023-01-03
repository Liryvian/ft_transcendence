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
		let newGame: Game = await this.gameService.create({
			user_one: data.user_one,
		});
		console.log(newGame.user_one.name);
		return newGame;
		// return this.gameService.create(createGameDto);
	}

	@Get()
	findAll() {
		return this.gameService.findAll(['user_one', 'user_two']);
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.gameService.findOne({
			where: { id },
			relations: { user_one: true, user_two: true },
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
