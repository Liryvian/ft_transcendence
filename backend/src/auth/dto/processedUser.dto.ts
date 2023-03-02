import { User } from '../../users/user/entities/user.entity';

export class ProcessedUserDto {
	redirectLocation: string;
	user: User;
}
