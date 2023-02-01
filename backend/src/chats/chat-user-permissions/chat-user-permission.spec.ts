import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../../shared/test.module';
import { UserService } from '../../users/user/user.service';
import { ChatService } from '../chat/chat.service';
import { PermissionService } from '../permissions/permission.service';
import * as crypto from 'crypto';

import { ChatUserPermission } from './entities/chat-user-permission.entity';
import { ChatUserPermissionService } from './chat-user-permission.service';
import { User } from '../../users/user/entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';

describe('Chat - User - Permission relationship', () => {
	let testingModule: TestingModule;

	let service: ChatUserPermissionService;

	let userService: UserService;
	let permissionService: PermissionService;
	let chatService: ChatService;

	const chat_ids: number[] = [];
	const user_ids: number[] = [];
	const permission_ids: number[] = [];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = testingModule.get<ChatUserPermissionService>(
			ChatUserPermissionService,
		);
		userService = testingModule.get<UserService>(UserService);
		permissionService = testingModule.get<PermissionService>(PermissionService);
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
		await permissionService
			.save([
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
				{ name: crypto.pseudoRandomBytes(4).toString('hex') },
			])
			.then((permissions) => {
				permissions.forEach((permission) => permission_ids.push(permission.id));
			});
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
		await permissionService.remove(permission_ids);
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
			permission_id: permission_ids[0],
		});
		expect(relation).toEqual({
			id: expect.any(Number),
			chat_id: chat_ids[0],
			user_id: user_ids[0],
			permission_id: permission_ids[0],
		});
		await service.remove(relation.id);
	});

	it('should not allow duplicate relationship in chat/user with same permission', async () => {
		await expect(
			service.save([
				{
					chat_id: chat_ids[0],
					user_id: user_ids[0],
					permission_id: permission_ids[0],
				},
				{
					chat_id: chat_ids[0],
					user_id: user_ids[0],
					permission_id: permission_ids[0],
				},
			]),
		).rejects.toThrow('UNIQUE');
	});

	it('should allow same user/chat different permissions', async () => {
		const relations: ChatUserPermission[] = await service.save([
			{
				chat_id: chat_ids[0],
				user_id: user_ids[0],
				permission_id: permission_ids[0],
			},
			{
				chat_id: chat_ids[0],
				user_id: user_ids[0],
				permission_id: permission_ids[1],
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
				permission_id: permission_ids[0],
			},
			{
				chat_id: chat_ids[1],
				user_id: user_ids[0],
				permission_id: permission_ids[0],
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
				permission_id: permission_ids[0],
			},
			{
				chat_id: chat_ids[0],
				user_id: user_ids[1],
				permission_id: permission_ids[0],
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
					permission_id: permission_ids[0],
				},
				{
					chat_id: chat_ids[0],
					user_id: user_ids[0],
					permission_id: permission_ids[1],
				},
				{
					chat_id: chat_ids[0],
					user_id: user_ids[1],
					permission_id: permission_ids[0],
				},
				{
					chat_id: chat_ids[1],
					user_id: user_ids[0],
					permission_id: permission_ids[0],
				},
				{
					chat_id: chat_ids[2],
					user_id: user_ids[0],
					permission_id: permission_ids[2],
				},
				{
					chat_id: chat_ids[2],
					user_id: user_ids[1],
					permission_id: permission_ids[2],
				},
				{
					chat_id: chat_ids[2],
					user_id: user_ids[2],
					permission_id: permission_ids[1],
				},
				{
					chat_id: chat_ids[1],
					user_id: user_ids[2],
					permission_id: permission_ids[0],
				},
			]);
		});

		afterAll(async () => {
			await service.findAll().then((relations) => {
				service.remove(relations.map((rel) => rel.id));
			});
		});

		it('From USER - should return the relationship to the chat/user/permission', async () => {
			const users: User[] = await userService.findAll({
				relations: { chatuser: { permissions: true } },
			});
			const dataToVerify = users.map((user) => ({
				id: user.id,
				chats: user.chats.map((chat) => chat.chat_id),
			}));
			expect(dataToVerify).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: user_ids[0],
						chats: expect.arrayContaining([chat_ids[0], chat_ids[1]]),
					}),
					expect.objectContaining({
						id: user_ids[1],
						chats: expect.arrayContaining([chat_ids[0]]),
					}),
				]),
			);
		});

		it('From CHAT - should return the relationship to the chat/user/permission', async () => {
			const chats: Chat[] = await chatService.findAll({
				where: { users_permissions: { chat_id: chat_ids[2] } },
				relations: { users_permissions: true },
				// relations: { users_permissions: { permissions: true } },
			});
			console.log(chats);
			chats.forEach((chat) => {
				console.log(JSON.stringify(chat, null, 2));
				// console.log(`chat ${chat.id}`, JSON.stringify(chat.users, null, 2));
			});

			console.log(
				JSON.stringify(
					await service.findAll({
						where: { chat_id: chat_ids[2] },
					}),
					null,
					2,
				),
			);

			// console.log(JSON.stringify(chats[0].users_permissions, null, 2));
			// console.log(JSON.stringify(chats[1].users_permissions, null, 2));
			// console.log('chat 1', JSON.stringify(chats[0].users, null, 2));
			// const dataToVerify = chats.map((chat) => ({
			// 	id: chat.id,
			// 	users: chat.users.map((user) => user.user_id),
			// }));
			// console.log('chat 2', JSON.stringify(chats[1].users, null, 2));
			// console.log(JSON.stringify(dataToVerify, null, 2));
			// console.log(JSON.stringify(chats, null, 2));
			// expect(dataToVerify).toEqual(
			// 	expect.arrayContaining([
			// 		expect.objectContaining({
			// 			id: chat_ids[0],
			// 			users: expect.arrayContaining([user_ids[0], user_ids[1]]),
			// 		}),
			// 		expect.objectContaining({
			// 			id: chat_ids[1],
			// 			users: expect.arrayContaining([user_ids[0]]),
			// 		}),
			// 	]),
			// );
		});
	});
});
