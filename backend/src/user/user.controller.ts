import {
	BadRequestException,
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Patch,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFailedError, UpdateResult } from 'typeorm';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	async all(): Promise<User[]> {
		return this.userService.all();
	}

	@Get(':id')
	async get(@Param('id') id: number) {
		return this.userService.findOne({
			where: {
				id: id,
			},
		});
	}

	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateAnimalDto: UpdateUserDto,
	): Promise<UpdateResult> {
		try {
			const updateResult = await this.userService.update(id, updateAnimalDto);
			return updateResult;
		} catch (e) {
			console.log({ e });
			if (e instanceof QueryFailedError) {
				throw new BadRequestException('Username should be unique 1');
			} else {
				throw new BadRequestException('Username should be unique 2');
			}
		}
	}
}
