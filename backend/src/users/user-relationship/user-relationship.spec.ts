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
		source: null,
		target: null,
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
		mockConnection.source = allUsers[0].id;
		mockConnection.target = allUsers[1].id;
	});

	it('should be defined, service and controller', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	describe('Single relationship test', () => {
		it('should create a relationship between two users', async () => {
			await service.save(mockConnection);
			const relationShips: UserRelationship[] = await service.findAll();

			expect(relationShips[0].source).toEqual(allUsers[0]);
			expect(relationShips[0].target).toEqual(allUsers[1]);
			expect(relationShips[0].type).toEqual(validRelationships.FRIEND);
		});
	});

	describe('multiple relationships test', () => {
		it('should create a relationship between two users', async () => {
			const arrayOfRelationship: CreateUserRelationshipDto[] = [
				{
					source: allUsers[0].id,
					target: allUsers[2].id,
					type: validRelationships.FRIEND,
				},
				{
					source: allUsers[2].id,
					target: allUsers[1].id,
					type: validRelationships.FRIEND,
				},
			];
			await service.save(arrayOfRelationship);
			const relationShips: UserRelationship[] = await service.findAll();

			expect(relationShips.length).toEqual(3);
			expect(relationShips[1].source).toEqual(allUsers[0]);
			expect(relationShips[1].target).toEqual(allUsers[2]);
			expect(relationShips[0].type).toEqual(validRelationships.FRIEND);

			expect(relationShips[2].source).toEqual(allUsers[2]);
			expect(relationShips[2].target).toEqual(allUsers[1]);
			expect(relationShips[0].type).toEqual(validRelationships.FRIEND);

			const users: User[] = await userService.findAll({
				relations: { relationshipSource: true, relationshipTarget: true },
			});
			users.forEach((user) => {
				expect(user.relationships.length).toEqual(2);
			});
		});
	});

	describe('Validation of relationshipRequest', () => {
		it('shoud return true users already have a relationship source/target', async () => {
			const testObject: CreateUserRelationshipDto = {
				source: 1,
				target: 2,
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
				source: user_id,
				target: allUsers[0].id,
				type: 'blocked',
			});

			const testObject: CreateUserRelationshipDto = {
				source: allUsers[0].id,
				target: user_id,
				type: 'friend',
			};
			// check that new relationship request cannot be mae even if ids are switched around
			expect(await service.hasExistingRelationship(testObject)).toBe(true);
		});
	});
	describe('CreateUserRelationshipDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		const testObject = {
			source: 1,
			target: 2,
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
		testObject.target = 1;
		it('should throw when ids are the same', async () => {
			await expect(validator.transform(testObject, meta)).rejects.toThrow(
				BadRequestException,
			);
		});
	});
});
