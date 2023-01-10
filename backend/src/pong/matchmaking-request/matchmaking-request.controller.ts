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
import { UpdateMatchmakingRequestDto } from './dto/update-matchmaking-request.dto';

@Controller('matchmaking-request')
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
		return this.matchmakingRequestService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.matchmakingRequestService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateMatchmakingRequestDto: UpdateMatchmakingRequestDto,
	) {
		return this.matchmakingRequestService.update(
			id,
			updateMatchmakingRequestDto,
		);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.matchmakingRequestService.remove(id);
	}
}
