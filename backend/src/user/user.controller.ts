import {
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import { AuthGuard } from '../auth/auth.guard';

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
}
