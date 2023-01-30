import { Injectable } from '@nestjs/common';
import { AnimalService } from '../test_example/animal.service';
import * as fs from 'fs';
import seedData from './seed.data';
import { UserService } from '../users/user/user.service';
import { GameService } from '../pong/game/game.service';
import { assert } from 'console';
import { Game } from '../pong/game/entities/game.entity';
import { ChatService } from '../chats/chat/chat.service';
import { Chat } from '../chats/chat/entities/chat.entity';
import { User } from '../users/user/entities/user.entity';

@Injectable()
export class SeederService {
	inject: [AnimalService, UserService, GameService];

	constructor(
		private readonly animalService: AnimalService,
		private readonly userService: UserService,
		private readonly gameService: GameService,
		private readonly chatService: ChatService,
	) {}

	private readonly shouldSeedFilePath = './dist/seeders/.hasSeeded';

	shouldSeed(): boolean {
		return fs.existsSync(this.shouldSeedFilePath) === false;
	}

	finilizeSeeding() {
		fs.writeFileSync(this.shouldSeedFilePath, '');
	}

	async seedUsers() {
		// passwords are visible
		await this.userService.trySeed(seedData.users());
	}

	async seedGames() {
		await this.gameService.trySeed(seedData.games());
		const seededGames: Game[] = await this.gameService.findAll();
		assert(seededGames.length === 3);

		seededGames[0].score_player_one = 10;
		seededGames[0].score_player_two = 5;
		seededGames[0].is_active = false;

		seededGames[1].score_player_one = 8;
		seededGames[1].score_player_two = 3;
		seededGames[1].is_active = false;

		seededGames[2].score_player_one = 12;
		seededGames[2].score_player_two = 7;
		seededGames[2].is_active = false;
		this.gameService.save(seededGames);
	}

	async seedChats() {
		await this.chatService.trySeed(seedData.chats());
	}

	async seedUserChats() {
		const allChats: Chat[] = await this.chatService.findAll();
		assert(allChats.length === 3);

		// get seeded users
		const allUsers: User[] = await this.userService.findAll({
			where: [
				{ name: 'flamink' },
				{ name: 'vaalboskat' },
				{ name: 'renoster' },
			],
		});
		assert(allUsers.length === 3);

		// add users to chat, which create teh userCaht rel
		allChats[0].users = allUsers;
		allChats[1].users = allUsers.slice(0, 2);
		allChats[2].users = allUsers.slice(1, 3);
		await this.chatService.save(allChats);
	}

	async seedDatabase() {
		if (this.shouldSeed()) {
			await this.seedUsers();
			await this.seedGames();
			await this.seedChats();
			await this.seedUserChats();
			await this.animalService.trySeed(seedData.animals());
			this.finilizeSeeding();
		}
	}
}
