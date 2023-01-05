import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { MembershipStateService } from './membership-state.service';
import { CreateMembershipStateDto } from './dto/create-membership-state.dto';
import { UpdateMembershipStateDto } from './dto/update-membership-state.dto';

@Controller('membership-state')
export class MembershipStateController {
	constructor(
		private readonly membershipStateService: MembershipStateService,
	) {}

	@Post()
	create(@Body() createMembershipStateDto: CreateMembershipStateDto) {
		return this.membershipStateService.create(createMembershipStateDto);
	}

	@Get()
	findAll() {
		return this.membershipStateService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.membershipStateService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateMembershipStateDto: UpdateMembershipStateDto,
	) {
		return this.membershipStateService.update(+id, updateMembershipStateDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.membershipStateService.remove(+id);
	}
}
