import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';
import { CreateGameDto } from '../pong/game/dto/create-game.dto';
import { CreateChatDto } from '../chats/chat/dto/create-chat.dto';

class seedUser {
	name: string;
	password: string;
	is_intra: boolean;
	avatar: string;
}

const seedData = {
	animals: () => {
		const animalSeeds: CreateAnimalDto[] = [
			{ name: 'Flamink' },
			{ name: 'Renoster' },
			{ name: 'Vaalboskat' },
		];
		return animalSeeds;
	},

	users: () => {
		const users: any[] = [
			{
				name: 'flamink',
				password: 'f',
				is_intra: false,
				avatar: 'seeded_profile_flamink.png',
			},
			{
				name: 'renoster',
				password: 'r',
				is_intra: false,
				avatar: 'seeded_profile_renoster.png',
			},
			{
				name: 'vaalboskat',
				password: 'v',
				is_intra: false,
				avatar: 'seeded_profile_vaalboskat.png',
			},
		];
		return users;
	},

	games: () => {
		const games: CreateGameDto[] = [
			{
				player_one: 1,
				player_two: 2,
			},
			{
				player_one: 2,
				player_two: 3,
			},
			{
				player_one: 3,
				player_two: 1,
			},
		];
		return games;
	},

	chats: () => {
		const chats: CreateChatDto[] = [
			{ name: 'Zoo' },
			{ name: 'flamink-renoster' },
			{ name: 'vaalboskat-renoster' },
		];
		return chats;
	},
};

export default seedData;
