import { RegisterUserDto } from '../users/user/dto/register-user.dto';
import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';
import { CreateGameDto } from '../pong/game/dto/create-game.dto';
import { CreateChatDto } from '../chats/chat/dto/create-chat.dto';

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
		const users: RegisterUserDto[] = [
			{ name: 'flamink', password: 'f', password_confirm: 'f' },
			{ name: 'renoster', password: 'r', password_confirm: 'r' },
			{ name: 'vaalboskat', password: 'v', password_confirm: 'v' },
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
	// userChats: () = {
	// 	const userChats: CreateUser
	// }
};

export default seedData;
