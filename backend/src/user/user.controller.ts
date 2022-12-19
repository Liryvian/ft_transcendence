import {ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors} from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
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
}
