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

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post()
	save(@Body() createGameDto: CreateGameDto) {
		return this.gameService.save(createGameDto);
	}

	@Get()
	findAll() {
		return this.gameService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.gameService.findOne({ where: { id } });
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
