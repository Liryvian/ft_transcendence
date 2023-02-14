import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../../shared/test.module';
import { UserService } from '../../users/user/user.service';
import { ChatService } from '../chat/chat.service';
// import { PermissionService } from '../permissions/permission.service';
import * as crypto from 'crypto';

import {
	ChatUserPermission,
	permissionsEnum,
} from './entities/chat-user-permission.entity';
import { ChatUserPermissionService } from './chat-user-permission.service';
import { User } from '../../users/user/entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';

describe('Chat - User - Permission relationship', () => {
	let testingModule: TestingModule;

	let service: ChatUserPermissionService;

	let userService: UserService;
	// let permissionService: PermissionService;
	let chatService: ChatService;

	const chat_ids: number[] = [];
	const user_ids: number[] = [];
	// const permission_ids: number[] = [];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = testingModule.get<ChatUserPermissionService>(
			ChatUserPermissionService,
		);
		userService = testingModule.get<UserService>(UserService);
		// permissionService = testingModule.get<PermissionService>(PermissionService);
		chatService = testingModule.get<ChatService>(ChatService);

		await userService
			.save([
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
			])
			.then((users) => {
				users.forEach((user) => user_ids.push(user.id));
			});
		// await permissionService
		// 	.save([
		// 		{ name: crypto.pseudoRandomBytes(4).toString('hex') },
		// 		{ name: crypto.pseudoRandomBytes(4).toString('hex') },
		// 		{ name: crypto.pseudoRandomBytes(4).toString('hex') },
		// 	])
		// 	.then((permissions) => {
		// 		permissions.forEach((permission) => permission_ids.push(permission.id));
		// 	});
		await chatService
			.save([
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
			])
			.then((chats) => {
				chats.forEach((chat) => chat_ids.push(chat.id));
			});
	});

	afterAll(async () => {
		// await permissionService.remove(permission_ids);
		await chatService.remove(chat_ids);
		await userService.remove(user_ids);
	});

	it('service should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should create a relationship between chat/user/permission', async () => {
		const relation: ChatUserPermission = await service.save({
			chat_id: chat_ids[0],
			user_id: user_ids[0],
			permission: permissionsEnum.READ,
		});
		expect(relation).toMatchObject({
			id: expect.any(Number),
			chat_id: chat_ids[0],
			user_id: user_ids[0],
			permission: permissionsEnum.READ,
		});
		await service.remove(relation.id);
	});

	it('should not allow duplicate relationship in chat/user with same permission', async () => {
		await expect(
			service.save([
				{
					chat_id: chat_ids[0],
					user_id: user_ids[0],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[0],
					user_id: user_ids[0],
					permission: permissionsEnum.READ,
				},
			]),
		).rejects.toThrow('UNIQUE');
	});

	it('should allow same user/chat different permissions', async () => {
		const relations: ChatUserPermission[] = await service.save([
			{
				chat_id: chat_ids[0],
				user_id: user_ids[0],
				permission: permissionsEnum.READ,
			},
			{
				chat_id: chat_ids[0],
				user_id: user_ids[0],
				permission: permissionsEnum.READ,
			},
		]);
		expect(relations).toHaveLength(2);
		await service.remove(relations.map((rel) => rel.id));
	});

	it('should allow one user to be in multiple chats', async () => {
		const relations: ChatUserPermission[] = await service.save([
			{
				chat_id: chat_ids[0],
				user_id: user_ids[0],
				permission: permissionsEnum.READ,
			},
			{
				chat_id: chat_ids[1],
				user_id: user_ids[0],
				permission: permissionsEnum.READ,
			},
		]);
		expect(relations).toHaveLength(2);
		await service.remove(relations.map((rel) => rel.id));
	});

	it('should allow one chat to have multiple users', async () => {
		const relations: ChatUserPermission[] = await service.save([
			{
				chat_id: chat_ids[0],
				user_id: user_ids[0],
				permission: permissionsEnum.READ,
			},
			{
				chat_id: chat_ids[0],
				user_id: user_ids[1],
				permission: permissionsEnum.READ,
			},
		]);
		expect(relations).toHaveLength(2);
		await service.remove(relations.map((rel) => rel.id));
	});

	describe('Relations to user/chat entities', () => {
		beforeAll(async () => {
			await service.save([
				{
					chat_id: chat_ids[0],
					user_id: user_ids[0],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[0],
					user_id: user_ids[0],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[0],
					user_id: user_ids[1],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[1],
					user_id: user_ids[0],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[2],
					user_id: user_ids[0],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[2],
					user_id: user_ids[1],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[2],
					user_id: user_ids[2],
					permission: permissionsEnum.READ,
				},
				{
					chat_id: chat_ids[1],
					user_id: user_ids[2],
					permission: permissionsEnum.READ,
				},
			]);
		});

		afterAll(async () => {
			await service.findAll().then((relations) => {
				service.remove(relations.map((rel) => rel.id));
			});
		});

		it('should have user1 in 3 chats', async () => {
			const userOne_chats = await userService.findOne({
				select: {
					id: true,
					name: true,
				},
				order: { in_chats: { chat_id: 'ASC' } },
				where: { id: user_ids[0] },
				relations: { in_chats: true },
			});
			// the result of the relationship
			expect(userOne_chats.in_chats).toHaveLength(4);
			// the result of the grouping on chat_id
			expect(userOne_chats.chats).toHaveLength(3);

			expect(userOne_chats.chats[0].chat_id).toBe(chat_ids[0]);
			expect(userOne_chats.chats[0].permissions.map((perm) => perm.id)).toEqual(
				[permission_ids[0], permission_ids[1]],
			);
			expect(userOne_chats.chats[1].chat_id).toBe(chat_ids[1]);
			expect(userOne_chats.chats[1].permissions.map((perm) => perm.id)).toEqual(
				[permission_ids[0]],
			);
			expect(userOne_chats.chats[2].chat_id).toBe(chat_ids[2]);
			expect(userOne_chats.chats[2].permissions.map((perm) => perm.id)).toEqual(
				[permission_ids[2]],
			);
		});

		it('should have user1 in chat1 with 2 permissions', async () => {
			const userOne_chats: User = await userService.findOne({
				select: {
					id: true,
					name: true,
				},
				where: { id: user_ids[0], in_chats: { chat_id: chat_ids[0] } },
				relations: { in_chats: true },
			});
			// the result of the relationship
			expect(userOne_chats.in_chats).toHaveLength(2);
			// the result of the grouping on chat_id
			expect(userOne_chats.chats).toHaveLength(1);

			expect(userOne_chats.chats[0].chat_id).toBe(chat_ids[0]);
			expect(userOne_chats.chats[0].permissions).toHaveLength(2);
		});

		it('should have 3 users in chat 3', async () => {
			const chat: Chat = await chatService.findOne({
				select: {
					id: true,
					name: true,
				},
				order: { has_users: { user_id: 'ASC' } },
				where: { id: chat_ids[2] },
				relations: { has_users: true },
			});

			expect(chat.has_users).toHaveLength(3);
			expect(chat.users).toHaveLength(3);

			expect(chat.users[0].user_id).toBe(user_ids[0]);
			expect(chat.users[1].user_id).toBe(user_ids[1]);
			expect(chat.users[2].user_id).toBe(user_ids[2]);

			expect(chat.users[0].permissions).toHaveLength(1);
			expect(chat.users[1].permissions).toHaveLength(1);
			expect(chat.users[2].permissions).toHaveLength(1);
		});
	});
});
