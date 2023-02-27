import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	BadRequestException,
	UseGuards,
} from '@nestjs/common';
import { UserRelationshipService } from './user-relationship.service';
import { CreateUserRelationshipDto } from './dto/create-user-relationship.dto';
import { UpdateUserRelationshipDto } from './dto/update-user-relationship.dto';
import { UserRelationship } from './entities/user-relationship.entity';
import AuthGuard from '../../auth/auth.guard';

@UseGuards(AuthGuard())
@Controller('user-relationships')
export class UserRelationshipController {
	constructor(private readonly service: UserRelationshipService) {}

	// to be removed as all users will be initialized with default NONE relationship
	@Post()
	async create(@Body() relationshipData: CreateUserRelationshipDto) {
		if (await this.service.hasExistingRelationship(relationshipData)) {
			throw new BadRequestException('Relation already exists between users');
		}

		try {
			const newRelationship = await this.service.save(relationshipData);
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

	@Get(':source/:target')
	async findExistingOne(
		@Param('source') source: number,
		@Param('target') target: number,
	): Promise<UserRelationship> {
		return await this.service.getExistingRelationship(source, target);
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
