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
import { UserService } from '../user/user.service';

@Controller('user-relationships')
export class UserRelationshipController {
	constructor(
		private readonly userRelationshipService: UserRelationshipService,
		private readonly userService: UserService,
	) {}

	@Post()
	async create(@Body() data: CreateUserRelationshipDto) {
		// const user1 = await this.userService.findOne({
		// 	relations: { relationshipSource: true, relationshipTarget: true },
		// 	where: { id: 3 },
		// });
		// const user2 = await this.userService.findOne({
		// 	relations: { relationshipSource: true, relationshipTarget: true },
		// 	where: { id: 2 },
		// });
		// console.log(user1, user2);
		const rel = await this.userRelationshipService.findAll({
			relations: { source_id: true, target_id: true },
			where: [
				{
					source_id: { id: data.source_id },
					target_id: { id: data.target_id },
				},
				{
					source_id: { id: data.target_id },
					target_id: { id: data.source_id },
				},
			],
		});
		console.log('\n\nFOUND\n\n', rel);
		if (rel) return;

		try {
			const newRelationship = await this.userRelationshipService.create(data);
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
