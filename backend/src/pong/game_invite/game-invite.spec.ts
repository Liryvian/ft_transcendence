import {
	ArgumentMetadata,
	BadRequestException,
	ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { globalValidationPipeOptions } from '../../../src/main.validationpipe';
import { CreateGameInviteDto } from './dto/create-game-invite.dto';
import { GameInvitesController } from './game-invite.controller';
import { GameInvitesService } from './game-invite.service';
import { AllTestingModule } from '../../shared/test.module';
import { User } from '../../users/user/entities/user.entity';
import { UserService } from '../../users/user/user.service';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { GameInvite } from './entities/game-invite.entity';

describe('GameInvite unit tests', () => {
	let service: GameInvitesService;
	let controller: GameInvitesController;
	let userService: UserService;
	let allUsers: User[];

	const mockUsers: CreateUserDto[] = [
		{ name: 'Miskruier', password: 'P' },
		{ name: 'Tor', password: 'T' },
	];

	const mockInvite: CreateGameInviteDto = { players: [] };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = module.get<GameInvitesService>(GameInvitesService);
		controller = module.get<GameInvitesController>(GameInvitesController);
		userService = module.get<UserService>(UserService);

		await userService.save(mockUsers);
		allUsers = await userService.findAll();
		allUsers.forEach((user: User) => {
			mockInvite.players.push(user.id);
		});
	});

	it('should be defined, service and controller', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('Creating relationship test', () => {
		it('should create a relationship between invite and user', async () => {
			const invite: GameInvite = await controller.create(mockInvite);
			expect(invite.players.length).toBe(2);
			expect(
				invite.players.every((player) => player instanceof User),
			).toBeTruthy();
		});
	});

	describe('CreateGameInviteDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		const testObject = {
			players: [1, 1],
		};

		const meta: ArgumentMetadata = {
			type: 'body',
			metatype: CreateGameInviteDto,
		};

		it('should work when initting with an array', async () => {
			const ObjectToTransform = {
				players: [1, 2],
			};
			const expectedObj: CreateGameInviteDto = {
				players: [1, 2],
			};
			validator.transform(ObjectToTransform, meta);
			expect(ObjectToTransform).toEqual(expectedObj);
		});

		it('should throw an error when source and target have the same id', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when source_id is empty', async () => {
			testObject.players[0] = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when source_id is NaN', async () => {
			const NaNtestObject = {
				players: ['1', 1],
			};
			await expect(validator.transform(NaNtestObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when target_id is empty', async () => {
			testObject.players[0] = 1;
			testObject.players[1] = null;
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should throw error when target_id is NaN', async () => {
			const NaNtestObject = {
				players: [1, '1'],
			};
			await expect(validator.transform(NaNtestObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
