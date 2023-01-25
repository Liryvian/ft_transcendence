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
	];

	const mockConnection: CreateUserRelationshipDto = {
		connection: [],
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
		allUsers.forEach((user: User) => {
			mockConnection.connection.push(user.id);
		});
	});

	it('should be defined, service and controller', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});

	// describe('Creating relationship test', () => {
	// 	it('should create a relationship between invite and user', async () => {
	// 		const invite: UserRelationship = await controller.create(mockConnection);
	// 		console.log(invite);
	// 		console.log(
	// 			await userService.findAll({ relations: { connections: true } }),
	// 			await controller.findAll(),
	// 		);
	// 		expect(invite.connection.length).toBe(2);
	// 		expect(
	// 			invite.connection.every((connectId) => connectId instanceof User),
	// 		).toBeTruthy();
	// 	});
	// });

	describe('Vincent relationship test', () => {
		it('Vincent create a relationship between invite and user', async () => {
			const invite: UserRelationship = await controller.create(mockConnection);
			expect(invite.connection.length).toBe(2);
			expect(
				invite.connection.every((connectId) => connectId instanceof User),
			).toBeTruthy();
			console.log('After first:', await controller.findAll());
			const invite2: UserRelationship = await controller.create({
				connection: [2, 1],
				type: validRelationships.FRIEND,
			});
			expect(invite2.connection.length).toBe(2);
			expect(
				invite2.connection.every((connectId) => connectId instanceof User),
			).toBeTruthy();
			console.log('After second', await controller.findAll());

			const invite3: UserRelationship = await controller.create({
				connection: [3, 2],
				type: validRelationships.FRIEND,
			});
			console.log('After third', await controller.findAll());
		});
	});

	describe('CreateUserRelationshipDto', () => {
		const validator = new ValidationPipe(globalValidationPipeOptions());

		const testObject = {
			players: [1, 2],
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
	});
});
