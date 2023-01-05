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
		return this.gameService.create({
			player_1: data.player_1,
			player_2: data.player_2,
		});
	}

	@Get()
	findAll() {
		return this.gameService.findAll(['player_1', 'player_2']);
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.gameService.findOne({
			where: { id },
			relations: { player_1: true, player_2: true },
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
