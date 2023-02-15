import { IsNotEmpty } from 'class-validator';
export class CreateUserAchievementDto {
	@IsNotEmpty()
	user_id: number;

	@IsNotEmpty()
	achievement_id: number;
}
