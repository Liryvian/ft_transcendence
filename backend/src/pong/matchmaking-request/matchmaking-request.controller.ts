import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { CreateMatchmakingRequestDto } from './dto/create-matchmaking-request.dto';

@Controller('matchmaking-requests')
export class MatchmakingRequestController {
	constructor(
		private readonly matchmakingRequestService: MatchmakingRequestService,
	) {}

	@Post()
	create(@Body() createMatchmakingRequestDto: CreateMatchmakingRequestDto) {
		return this.matchmakingRequestService.create(createMatchmakingRequestDto);
	}

	@Get()
	findAll() {
		return this.matchmakingRequestService.findAll({
			relations: { user: true },
		});
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.matchmakingRequestService.findOne({
			where: { id },
			relations: { user: true },
		});
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.matchmakingRequestService.remove(id);
	}
}
