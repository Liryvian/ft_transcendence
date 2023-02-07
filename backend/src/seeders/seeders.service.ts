import { Injectable } from '@nestjs/common';
import { AnimalService } from '../test_example/animal.service';
import * as fs from 'fs';
import seedData from './seed.data';
import { UserService } from '../users/user/user.service';
import { GameService } from '../pong/game/game.service';
import { assert } from 'console';
import { Game } from '../pong/game/entities/game.entity';
import { ChatService } from '../chats/chat/chat.service';
import { User } from '../users/user/entities/user.entity';
import { UserRelationshipService } from '../users/user-relationship/user-relationship.service';
import { CreateUserRelationshipDto } from '../users/user-relationship/dto/create-user-relationship.dto';
import { validRelationships } from '../users/user-relationship/entities/user-relationship.entity';

@Injectable()
export class SeederService {
	inject: [AnimalService, UserService, GameService];

	constructor(
		private readonly animalService: AnimalService,
		private readonly userService: UserService,
		private readonly gameService: GameService,
		private readonly chatService: ChatService,
		private readonly userRelService: UserRelationshipService,
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

	async seedUserRelationships() {
		const allUsers: User[] = await this.userService.findAll({
			where: [
				{ name: 'flamink' },
				{ name: 'vaalboskat' },
				{ name: 'renoster' },
			],
		});
		const rel: CreateUserRelationshipDto[] = [
			{
				source_id: allUsers[0].id,
				target_id: allUsers[1].id,
				type: validRelationships.FRIEND,
			},
			{
				source_id: allUsers[0].id,
				target_id: allUsers[2].id,
				type: validRelationships.BLOCKED,
			},
		];
		await this.userRelService.save(rel);
	}

	async seedDatabase() {
		if (this.shouldSeed()) {
			await this.seedUsers();
			await this.seedGames();
			await this.seedChats();
			await this.seedUserRelationships();
			await this.animalService.trySeed(seedData.animals());
			this.finilizeSeeding();
		}
	}
}
