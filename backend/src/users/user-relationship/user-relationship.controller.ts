import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { CreateUserRelationshipDto } from './dto/create-user-relationship.dto';

@Controller('user-relationships')
export class UserRelationshipController {
	constructor(
		private readonly userRelationshipService: UserRelationshipService,
	) {}

	@Post()
	async create(@Body() createUserRelationshipDto: CreateUserRelationshipDto) {
		return this.userRelationshipService.createAndSave(
			createUserRelationshipDto,
		);
	}

	@Get()
	async findAll() {
		return this.userRelationshipService.findAll({
			relations: { connection: true },
		});
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		return this.userRelationshipService.findOne({
			where: { id },
			relations: { connection: true },
		});
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateUserRelationshipDto: UpdateUserRelationshipDto,
	) {
		return this.userRelationshipService.update(id, updateUserRelationshipDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		return this.userRelationshipService.remove(id);
	}
}
