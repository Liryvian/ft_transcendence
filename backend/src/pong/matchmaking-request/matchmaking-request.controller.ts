import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	BadRequestException,
	UseGuards,
} from '@nestjs/common';
import { MatchmakingRequestService } from './matchmaking-request.service';
import { CreateMatchmakingRequestDto } from './dto/create-matchmaking-request.dto';
import { MatchmakingRequest } from './entities/matchmaking-request.entity';
import AuthGuard from '../../auth/auth.guard';

@UseGuards(AuthGuard())
@Controller('matchmaking-requests')
export class MatchmakingRequestController {
	constructor(
		private readonly matchmakingRequestService: MatchmakingRequestService,
	) {}

	@Post()
	async save(@Body() createMatchmakingRequestDto: CreateMatchmakingRequestDto) {
		try {
			const newRequest: MatchmakingRequest =
				await this.matchmakingRequestService.save(createMatchmakingRequestDto);
			return newRequest;
		} catch (e) {
			throw new BadRequestException(
				'User has to exist and should have no open game request',
			);
		}
	}

	@Get()
	async findAll() {
		return this.matchmakingRequestService.findAll({
			relations: { user: true },
		});
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		return this.matchmakingRequestService.findOne({
			where: { id },
			relations: { user: true },
		});
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		return this.matchmakingRequestService.remove(id);
	}
}
