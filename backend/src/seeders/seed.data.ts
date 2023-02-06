import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';
import { CreateChatDto } from '../chats/chat/dto/create-chat.dto';
import { CreateUserRelationshipDto } from '../users/user-relationship/dto/create-user-relationship.dto';
import { validRelationships } from '../users/user-relationship/entities/user-relationship.entity';
import * as bcrypt from 'bcrypt';

class seedUser {
	name: string;
	password: string;
	is_intra: boolean;
	avatar?: string;
}

class seedGame {
	player_one: number;
	player_two: number;
	score_player_one: number;
	score_player_two: number;
	is_active: boolean;
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

	users: async () => {
		const users: seedUser[] = [
			{
				name: 'flamink',
				password: await bcrypt.hash('f', 11),
				is_intra: false,
				avatar: 'seeded_profile_flamink.png',
			},
			{
				name: 'renoster',
				password: await bcrypt.hash('r', 11),
				is_intra: false,
				avatar: 'seeded_profile_renoster.png',
			},
			{
				name: 'vaalboskat',
				password: await bcrypt.hash('v', 11),
				is_intra: false,
				avatar: 'seeded_profile_vaalboskat.png',
			},
			{
				name: 'aardwolf',
				password: await bcrypt.hash('a', 11),
				is_intra: false,
				avatar: 'seeded_profile_aardwolf.png',
			},
		];
		return users;
	},

	userRelations: (ids: number[]) => {
		const userRelations: CreateUserRelationshipDto[] = [
			{
				source_id: ids[0],
				target_id: ids[1],
				type: validRelationships.FRIEND,
			},
			{
				source_id: ids[0],
				target_id: ids[2],
				type: validRelationships.BLOCKED,
			},
		];
		return userRelations;
	},

	games: (ids: number[]) => {
		const games: seedGame[] = [
			{
				player_one: ids[0],
				player_two: ids[1],
				score_player_one: 10,
				score_player_two: 5,
				is_active: false,
			},
			{
				player_one: ids[1],
				player_two: ids[2],
				score_player_one: 8,
				score_player_two: 3,
				is_active: false,
			},
			{
				player_one: ids[2],
				player_two: ids[0],
				score_player_one: 12,
				score_player_two: 7,
				is_active: false,
			},
			{
				player_one: ids[3],
				player_two: ids[2],
				score_player_one: 4,
				score_player_two: 10,
				is_active: false,
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
