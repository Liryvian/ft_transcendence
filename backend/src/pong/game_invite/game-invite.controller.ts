import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { GameInvitesService } from './game-invite.service';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';

@Controller('game-invites')
export class GameInvitesController {
	constructor(private readonly gameInvitesService: GameInvitesService) {}

	@Post()
	create(@Body() createGameInviteDto: CreateGameInviteDto) {
		return this.gameInvitesService.create(createGameInviteDto);
	}

	@Get()
	findAll() {
		return this.gameInvitesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.gameInvitesService.findOne({ where: { id } });
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.gameInvitesService.remove(id);
	}
}
