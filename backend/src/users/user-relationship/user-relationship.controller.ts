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
import { UserRelationship } from './entities/user-relationship.entity';
import { DataSource, In } from 'typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';

@Controller('user-relationships')
export class UserRelationshipController {
	constructor(
		private readonly userRelationshipService: UserRelationshipService,
	) {}

	@Post()
	async create(@Body() createUserRelationshipDto: CreateUserRelationshipDto) {
		const repo = await this.userRelationshipService.createAndSave(
			createUserRelationshipDto,
		);

		console.log('source id:', repo.source_id, 'target id:', repo.target_id);
		const rel = await this.userRelationshipService.findAll({
			relations: {
				source_id: true,
				target_id: true,
			},
			where: {
				source_id: {
					id: In([
						createUserRelationshipDto.source_id,
						createUserRelationshipDto.target_id,
					]),
				},
				target_id: {
					id: In([
						createUserRelationshipDto.source_id,
						createUserRelationshipDto.target_id,
					]),
				},
			},
		});
		// const rel1 = await this.userRelationshipService.findOne({
		// 	where: {
		// 		source_id: createUserRelationshipDto.target_id,
		// 		target_id: createUserRelationshipDto.source_id,
		// 	},
		// 	relations: { source_id: true, target_id: true },
		// });

		// rel always exists, since findAll can return an empty array (which is "truthy")
		if (rel.length > 0) {
			console.log('Rel:', rel);
			console.log('\nreturning here!!!\n');
			return;
		}
		try {
			const newRelationship = await this.userRelationshipService.create(
				createUserRelationshipDto,
			);
			return newRelationship;
		} catch (e) {
			throw new BadRequestException(
				'All connection Ids must be unique numbers',
			);
		}
	}

	@Get()
	async findAll() {
		return this.userRelationshipService.findAll({
			relations: { source_id: true, target_id: true },
		});
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		return this.userRelationshipService.findOne({
			where: { id },
			relations: { source_id: true, target_id: true },
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
