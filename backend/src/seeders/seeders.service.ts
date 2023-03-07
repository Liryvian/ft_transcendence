import { Injectable } from '@nestjs/common';
import { AnimalService } from '../test_example/animal.service';
import * as fs from 'fs';
import seedData from './seed.data';
import { UserService } from '../users/user/user.service';
import { GameService } from '../pong/game/game.service';
import { ChatService } from '../chats/chat/chat.service';
import { User } from '../users/user/entities/user.entity';
import { UserRelationshipService } from '../users/user-relationship/user-relationship.service';
import { MessageService } from '../chats/message/message.service';
import { ChatUserPermissionService } from '../chats/chat-user-permissions/chat-user-permission.service';
import { AchievementsService } from '../users/achievements/achievements.service';
import { UserAchievementsService } from '../users/user-achievements/user-achievements.service';

@Injectable()
export class SeederService {
	inject: [AnimalService, UserService, GameService];

	constructor(
		private readonly animalService: AnimalService,
		private readonly userService: UserService,
		private readonly gameService: GameService,
		private readonly chatService: ChatService,
		private readonly userRelService: UserRelationshipService,
		private readonly messageService: MessageService,
		private readonly chatUserPermissionService: ChatUserPermissionService,
		private readonly achievementService: AchievementsService,
		private readonly userAchievementsService: UserAchievementsService,
	) {}
	private readonly shouldSeedFilePath = './.hasSeeded';

	shouldSeed(): boolean {
		return fs.existsSync(this.shouldSeedFilePath) === false;
	}

	finilizeSeeding() {
		fs.writeFileSync(this.shouldSeedFilePath, '');
	}

	async seedUsers() {
		await this.userService.trySeed(await seedData.users());
	}

	async seedGames() {
		const users = await this.userService.findAll();
		await this.gameService.trySeed(seedData.games(users.map((u) => u.id)));
	}

	async seedChats() {
		await this.chatService.trySeed(seedData.chats());
	}

	async seedUserRelationships() {
		const users: User[] = await this.userService.findAll();
		return await this.userRelService.trySeed(
			seedData.userRelations(users.map((u) => u.id)),
		);
	}

	async seedChatUserPermissions() {
		const users = (
			await this.userService.findAll({ order: { name: 'asc' } })
		).map((u) => ({ id: u.id, name: u.name }));
		const chats = (
			await this.chatService.findAll({ order: { name: 'asc' } })
		).map((c) => ({ id: c.id, name: c.name }));

		return this.chatUserPermissionService.trySeed(
			seedData.chatUserPermission(users, chats),
		);
	}

	async seedAchievements() {
		return this.achievementService.trySeed(seedData.achievements());
	}

	async seedUserAchievements() {
		const achievements = (await this.achievementService.findAll()).map(
			(a) => a.id,
		);
		const users: number[] = (
			await this.userService.findAll({ order: { name: 'asc' } })
		).map((u) => u.id);
		return this.userAchievementsService.trySeed(
			seedData.userAchievements(users, achievements),
		);
	}

	async seedMessages() {
		const users = (
			await this.userService.findAll({ order: { name: 'asc' } })
		).map((u) => ({ id: u.id, name: u.name }));
		const chats = (
			await this.chatService.findAll({ order: { name: 'asc' } })
		).map((c) => ({ id: c.id, name: c.name }));

		return this.messageService.trySeed(seedData.messages(users, chats));
	}

	async seedDatabase() {
		// if (this.shouldSeed()) {
		// 	await this.animalService.removeAll();
		// 	await this.userRelService.removeAll();
		// 	await this.gameService.removeAll();
		// 	await this.chatUserPermissionService.removeAll();
		// 	await this.userAchievementsService.removeAll();
		//
		// 	await this.messageService.removeAll();
		// 	await this.chatService.removeAll();
		// 	await this.userService.removeAll();
		//
		// 	await this.achievementService.removeAll();
		//
		// 	await this.seedUsers();
		// 	await this.seedGames();
		// 	await this.seedChats();
		// 	await this.seedUserRelationships();
		// 	await this.seedChatUserPermissions();
		// 	await this.seedAchievements();
		// 	await this.seedUserAchievements();
		// 	await this.seedMessages();
		// 	await this.animalService.trySeed(seedData.animals());
		// 	this.finilizeSeeding();
		// }
	}
}
