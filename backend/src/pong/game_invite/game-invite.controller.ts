import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { GameInvitesService } from './game-invite.service';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';
import AuthGuard from '../../auth/auth.guard';

@UseGuards(AuthGuard())
@Controller('game-invites')
export class GameInvitesController {
	constructor(private readonly gameInvitesService: GameInvitesService) {}

	@Post()
	create(@Body() createGameInviteDto: CreateGameInviteDto) {
		return this.gameInvitesService.createAndSave(createGameInviteDto);
	}

	@Get()
	findAll() {
		return this.gameInvitesService.findAll({ relations: { players: true } });
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.gameInvitesService.findOne({
			where: { id },
			relations: { players: true },
		});
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.gameInvitesService.remove(id);
	}
}
