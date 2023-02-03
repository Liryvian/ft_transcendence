import {
	ArgumentMetadata,
	BadRequestException,
	ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { globalValidationPipeOptions } from '../../../src/main.validationpipe';
import { AllTestingModule } from '../../shared/test.module';
import { User } from '../../users/user/entities/user.entity';
import { UserService } from '../../users/user/user.service';
import { CreateUserDto } from '../../users/user/dto/create-user.dto';
import { UserRelationshipService } from './user-relationship.service';
import { UserRelationshipController } from './user-relationship.controller';
import { CreateUserRelationshipDto } from './dto/create-user-relationship.dto';
import {
	UserRelationship,
	validRelationships,
} from './entities/user-relationship.entity';

describe('GameInvite unit tests', () => {
	let service: UserRelationshipService;
	let controller: UserRelationshipController;
	let userService: UserService;
	let allUsers: User[];

	const mockUsers: CreateUserDto[] = [
		{ name: 'Miskruier', password: 'P' },
		{ name: 'Tor', password: 'T' },
		{ name: 'Visarend', password: 'V' },
	];

	const mockConnection: CreateUserRelationshipDto = {
		source_id: null,
		target_id: null,
		type: validRelationships.FRIEND,
	};

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = module.get<UserRelationshipService>(UserRelationshipService);
		controller = module.get<UserRelationshipController>(
			UserRelationshipController,
		);
		userService = module.get<UserService>(UserService);

		await userService.save(mockUsers);
		allUsers = await userService.findAll();
		mockConnection.source_id = allUsers[0].id;
		mockConnection.target_id = allUsers[1].id;
	});

	it('should be defined, service and controller', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('Single relationship test', () => {
		it('should create a relationship between two users', async () => {
			await service.save(mockConnection);
			const relationShips: UserRelationship[] = await service.findAll();

			expect(relationShips[0].source_id).toEqual(allUsers[0]);
			expect(relationShips[0].target_id).toEqual(allUsers[1]);
			expect(relationShips[0].type).toEqual(validRelationships.FRIEND);
		});
	});

	describe('multiple relationships test', () => {
		it('should create a relationship between two users', async () => {
			const arrayOfRelationship: CreateUserRelationshipDto[] = [
				{
					source_id: allUsers[0].id,
					target_id: allUsers[2].id,
					type: validRelationships.FRIEND,
				},
				{
					source_id: allUsers[2].id,
					target_id: allUsers[1].id,
					type: validRelationships.FRIEND,
				},
			];
			await service.save(arrayOfRelationship);
			const relationShips: UserRelationship[] = await service.findAll();

			expect(relationShips.length).toEqual(3);
			expect(relationShips[1].source_id).toEqual(allUsers[0]);
			expect(relationShips[1].target_id).toEqual(allUsers[2]);
			expect(relationShips[0].type).toEqual(validRelationships.FRIEND);

			expect(relationShips[2].source_id).toEqual(allUsers[2]);
			expect(relationShips[2].target_id).toEqual(allUsers[1]);
			expect(relationShips[0].type).toEqual(validRelationships.FRIEND);

			const users: User[] = await userService.findAll({
				relations: { relationshipSource: true, relationshipTarget: true },
			});
			users.forEach((user) => {
				expect(user.relationships.length).toEqual(2);
			});
		});
	});

	describe('hasExistingRelaionship', () => {
		it('should return true when rel exists', async () => {
			expect(await service.hasExistingRelationship(mockConnection)).toEqual(
				true,
			);
		});

		it('should return false on nonexistant', async () => {
			expect(
				await service.hasExistingRelationship({
					source_id: 1,
					target_id: 999,
					type: 'none',
				}),
			).toEqual(false);
		});
	});

	describe('Validation of relationshipRequest', () => {
		it('shoud return true users already have a relationship source/target', async () => {
			const testObject: CreateUserRelationshipDto = {
				source_id: 1,
				target_id: 2,
				type: 'friend',
			};
			expect(await service.hasExistingRelationship(testObject)).toBe(true);
		});

		it("should return true when source and target id's are switched around", async () => {
			const user_id: number = (
				await userService.save({
					name: 'Kokkenoster',
					password: 'K',
				})
			).id;

			await controller.create({
				source_id: user_id,
				target_id: allUsers[0].id,
				type: 'blocked',
			});

			const testObject: CreateUserRelationshipDto = {
				source_id: allUsers[0].id,
				target_id: user_id,
				type: 'friend',
			};
			// check that new relationship request cannot be mae even if ids are switched around
			expect(await service.hasExistingRelationship(testObject)).toBe(true);
		});
	});
	describe('CreateUserRelationshipDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		const testObject = {
			source_id: 1,
			target_id: 2,
			type: 'invalidType',
		};

		const meta: ArgumentMetadata = {
			type: 'body',
			metatype: CreateUserRelationshipDto,
		};

		it('should throw when invalid type is given', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
		testObject.target_id = 1;
		it('should throw when ids are the same', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
