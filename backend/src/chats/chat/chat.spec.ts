import { Test, TestingModule } from '@nestjs/testing';

import { Chat } from './entities/chat.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AllTestingModule } from '../../shared/test.module';
import { ChatUserPermissionService } from '../chat-user-permissions/chat-user-permission.service';
import { UserService } from '../../users/user/user.service';
import { User } from '../../users/user/entities/user.entity';
import { PermissionService } from '../permissions/permission.service';
import { Permission } from '../permissions/entities/permission.entity';
import { ChatUserPermission } from '../chat-user-permissions/entities/chat-user-permission.entity';
import { DeleteResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ChatController', () => {
	let controller: ChatController;
	let service: ChatService;
	let testingModule: TestingModule;
	let chatUserPermissionService: ChatUserPermissionService;
	let permissionService: PermissionService;
	let userService: UserService;

	const testChats: CreateChatDto[] = [
		{ name: 'A', visibility: 'public', password: 'A' },
		{ name: 'B', visibility: 'private', password: 'B' },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		controller = testingModule.get<ChatController>(ChatController);
		service = testingModule.get<ChatService>(ChatService);
		chatUserPermissionService = testingModule.get<ChatUserPermissionService>(
			ChatUserPermissionService,
		);
		userService = testingModule.get<UserService>(UserService);
		permissionService = testingModule.get<PermissionService>(PermissionService);

		for (const chat in testChats) {
			await controller.create(testChats[chat]);
		}
	});

	afterAll(async () => {
		const repoOfChats: Chat[] = await controller.findAll();
		for (let i = 0; i < repoOfChats.length; i++) {
			await controller.remove(i + 1);
		}
	});

	it('Get all Chats', async () => {
		const allChats: Chat[] = await controller.findAll();
		expect(allChats).toHaveLength(2);
		for (let index = 0; index < allChats.length; index++) {
			expect(allChats).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						name: testChats[index].name,
						visibility: testChats[index].visibility,
						password: testChats[index].password,
					}),
				]),
			);
		}
	});

	it('should delete relations in chat-user-permisison table before deleting chat', async () => {
		const user: User = await userService.save({ name: 'a' });
		const perm: Permission = await permissionService.save({ name: 'perm' });
		const chat: Chat = await service.save({ name: 'chatroom' });

		const relation: ChatUserPermission = await chatUserPermissionService.save({
			chat_id: chat.id,
			user_id: user.id,
			permission_id: perm.id,
		});
		const removed: DeleteResult = await controller.remove(chat.id);
		expect(removed.affected).toBe(1);
		expect(
			chatUserPermissionService.findOne({ where: { id: relation.id } }),
		).rejects.toThrow(NotFoundException);

		await userService.remove(user.id);
		await permissionService.remove(perm.id);
		await service.remove(chat.id);
	});
});

// cosnt mockCR: createChatDTo = [{name: "hallo", visibility:  "Private", password: "1234"}, {data, data, data}, {}]
