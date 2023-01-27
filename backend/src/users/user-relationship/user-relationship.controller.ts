import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	BadRequestException,
} from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { CreateUserRelationshipDto } from './dto/create-user-relationship.dto';
import { UpdateUserRelationshipDto } from './dto/update-user-relationship.dto';

@Controller('user-relationships')
export class UserRelationshipController {
	constructor(private readonly service: UserRelationshipService) {}

	@Post()
	async create(@Body() realtionshipData: CreateUserRelationshipDto) {
		if (await this.service.hasExistingRelationship(realtionshipData)) {
			throw new BadRequestException('Relation already exists between users');
		}

		try {
			const newRelationship = await this.service.save(realtionshipData);
			return newRelationship;
		} catch (e) {
			throw new BadRequestException(
				'All connection Ids must be unique numbers',
			);
		}
	}

	@Get()
	async findAll() {
		return this.service.findAll({
			relations: { source_id: true, target_id: true },
		});
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		return this.service.findOne({
			where: { id },
			relations: { source_id: true, target_id: true },
		});
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateUserRelationshipDto: UpdateUserRelationshipDto,
	) {
		return this.service.update(id, updateUserRelationshipDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: number) {
		return this.service.remove(id);
	}
}
