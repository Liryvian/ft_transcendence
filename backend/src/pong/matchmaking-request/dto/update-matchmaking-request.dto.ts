import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchmakingRequestDto } from './create-matchmaking-request.dto';

export class UpdateMatchmakingRequestDto extends PartialType(CreateMatchmakingRequestDto) {}
