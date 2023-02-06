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
	) {}
	// on my local machine the src doesn't exist in this path
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
		const allUsers: User[] = await this.userService.findAll();
		return await this.userRelService.trySeed(allUsers.map((u) => u.id));
	}

	async seedDatabase() {
		if (this.shouldSeed()) {
			await this.animalService.removeAll();
			await this.userRelService.removeAll();
			await this.gameService.removeAll();

			await this.messageService.removeAll();
			await this.chatService.removeAll();
			await this.userService.removeAll();

			await this.seedUsers();
			await this.seedGames();
			await this.seedChats();
			await this.seedUserRelationships();
			await this.animalService.trySeed(seedData.animals());
			this.finilizeSeeding();
		}
	}
}
