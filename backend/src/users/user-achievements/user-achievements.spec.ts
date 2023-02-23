import { Test, TestingModule } from '@nestjs/testing';
import { assert } from 'console';
import { AllTestingModule } from '../../shared/test.module';
import { AchievementsService } from '../achievements/achievements.service';
import { Achievement } from '../achievements/entities/achievement.entity';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserAchievementsController } from './user-achievements.controller';
import { UserAchievementsService } from './user-achievements.service';

describe('UserAchievementsController', () => {
	let controller: UserAchievementsController;
	let service: UserAchievementsService;
	let userService: UserService;
	let achievementService: AchievementsService;

	let allUsers: User[];
	let allAchievements: Achievement[];

	const mockUsers: RegisterUserDto[] = [
		{ name: 'Vaalboskat', password: 'V', password_confirm: 'V' },
		{ name: 'Flamink', password: 'F', password_confirm: 'F' },
		{ name: 'Renoster', password: 'R', password_confirm: 'R' },
	];

	const mockAchievements: any[] = [
		{ name: 'Plep' },
		{ name: 'BallsToTheWall' },
		{ name: 'Baas' },
		{ name: 'Gjas' },
	];

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		controller = module.get<UserAchievementsController>(
			UserAchievementsController,
		);
		service = module.get<UserAchievementsService>(UserAchievementsService);
		userService = module.get<UserService>(UserService);
		achievementService = module.get<AchievementsService>(AchievementsService);

		await userService.save(mockUsers);
		await achievementService.save(mockAchievements);

		allUsers = await userService.findAll({ relations: { achievements: true } });
		allAchievements = await achievementService.findAll();

		assert(allUsers.length === 3);
		assert(allAchievements.length === 4);
	});

	afterAll(async () => {
		const arrayOfIdsToDelete: number[] = [];
		for (let i = 0; i < allUsers.length; i++) {
			arrayOfIdsToDelete.push(allUsers[i].id);
		}
		await userService.remove(arrayOfIdsToDelete);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
		expect(service).toBeDefined();
	});

	describe('user-achievements', () => {
		it('should create an array of achievements in user', async () => {
			await service.save({
				user_id: allUsers[0].id,
				achievement_id: allAchievements[0].id,
			});

			const achievementsOfUser: Achievement[] = (
				await userService.findOne({
					where: { id: allUsers[0].id },
					relations: { achievements: true },
				})
			).achievements;

			expect(achievementsOfUser).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: allAchievements[0].id,
						name: allAchievements[0].name,
					}),
				]),
			);
		});

		it('should be possible for multiple users to have the same achievement', async () => {
			await service.save([
				{
					user_id: allUsers[1].id,
					achievement_id: allAchievements[1].id,
				},
				{
					user_id: allUsers[2].id,
					achievement_id: allAchievements[1].id,
				},
			]);

			const sameAchievementUsers: User[] = await userService.findAll({
				relations: { achievements: true },
			});
			//  check the two newly created realtionships (users[1 and 2])

			expect(sameAchievementUsers[1].achievements).toEqual(
				sameAchievementUsers[2].achievements,
			);
		});

		it('should be possible to have many achievements', async () => {
			// save new achievements
			await service.save([
				{
					user_id: allUsers[0].id,
					achievement_id: allAchievements[1].id,
				},
				{
					user_id: allUsers[0].id,
					achievement_id: allAchievements[2].id,
				},
			]);

			//  get the achievements of a specific user
			const userWithAllAchievements: Achievement[] = (
				await userService.findOne({
					where: { id: allUsers[0].id },
					relations: { achievements: true },
				})
			).achievements;

			// check that it contains an array of achievements
			expect(userWithAllAchievements).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: allAchievements[0].id,
						name: allAchievements[0].name,
					}),
					expect.objectContaining({
						id: allAchievements[1].id,
						name: allAchievements[1].name,
					}),
					expect.objectContaining({
						id: allAchievements[2].id,
						name: allAchievements[2].name,
					}),
				]),
			);
		});

		it('should only be possible to have one of each achievement', async () => {
			await expect(
				service.save({
					user_id: allUsers[0].id,
					achievement_id: allAchievements[0],
				}),
			).rejects.toThrow('UNIQUE constraint failed: user_achievements.user_id');
			//  service throws SQL error but controller catches it and throw BadRequestException
		});
	});
});
