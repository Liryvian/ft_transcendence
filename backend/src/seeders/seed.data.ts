import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';
import { CreateChatDto } from '../chats/chat/dto/create-chat.dto';
import { CreateUserRelationshipDto } from '../users/user-relationship/dto/create-user-relationship.dto';
import { validRelationships } from '../users/user-relationship/entities/user-relationship.entity';
import * as bcrypt from 'bcrypt';
import { CreateChatUserPermissionDto } from '../chats/chat-user-permissions/dto/create-chat-user-permission.dto';
import { CreateUserAchievementDto } from '../users/user-achievements/dto/create-user-achievement.dto';
import { CreateMessageDto } from '../chats/message/dto/create-message.dto';

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
				name: 'aardwolf',
				password: await bcrypt.hash('a', 11),
				is_intra: false,
				avatar: 'seeded_profile_aardwolf.png',
			},
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
			{
				source_id: ids[0],
				target_id: ids[3],
				type: validRelationships.FRIEND,
			},
			{
				source_id: ids[1],
				target_id: ids[2],
				type: validRelationships.FRIEND,
			},
			{
				source_id: ids[1],
				target_id: ids[3],
				type: validRelationships.FRIEND,
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
			{ name: 'Desert' },
			{ name: 'flamink-renoster', type: 'dm' },
			{ name: 'vaalboskat-renoster', type: 'dm' },
			{ name: 'Zoo' },
		];
		return chats;
	},

	permissions: () => {
		return [
			{ name: 'blocked' }, //       0
			{ name: 'edit_settings' }, // 1
			{ name: 'left' }, //          2
			{ name: 'manage_users' }, //  3
			{ name: 'post' }, //          4
			{ name: 'read' }, //          5
		];
	},

	achievements: () => {
		return [
			{ name: 'logged in 10 times' },
			{ name: 'created a channel' },
			{ name: 'You turned on 2fa! Nice job security geek!' },
		];
	},

	userAchievements: (users: number[], achievements: number[]) => {
		const userAchievements: CreateUserAchievementDto[] = [
			{ user_id: users[0], achievement_id: achievements[0] },
			{ user_id: users[1], achievement_id: achievements[0] },
			{ user_id: users[2], achievement_id: achievements[1] },
		];
		return userAchievements;
	},

	chatUserPermission: (
		users: number[],
		chats: number[],
		permissions: number[],
	) => {
		const cups: CreateChatUserPermissionDto[] = [];

		// Add flamink and renoster to their DM
		[permissions[4], permissions[5]].forEach((p) => {
			[users[1], users[2]].forEach((u) => {
				cups.push({
					chat_id: chats[1],
					user_id: u,
					permission_id: p,
				});
			});
		});

		// Add vaalboskat and renoster to their DM
		[permissions[4], permissions[5]].forEach((p) => {
			[users[3], users[2]].forEach((u) => {
				cups.push({
					chat_id: chats[2],
					user_id: u,
					permission_id: p,
				});
			});
		});

		// make renoster admin of Desert
		[permissions[1], permissions[3], permissions[4]].forEach((p) => {
			cups.push({
				chat_id: chats[0],
				user_id: users[2],
				permission_id: p,
			});
		});

		// add everybody with all permissions to 'Zoo'
		[permissions[1], permissions[3], permissions[4], permissions[5]].forEach(
			(p) => {
				users.forEach((u) => {
					cups.push({
						chat_id: chats[3],
						user_id: u,
						permission_id: p,
					});
				});
			},
		);

		// add everybody to 'Desert' with read permission
		users
			.map(
				(u) =>
					({
						chat_id: chats[0],
						user_id: u,
						permission_id: permissions[5],
					} as CreateChatUserPermissionDto),
			)
			.forEach((cup) => cups.push(cup));
		return cups;
	},

	messages: (users: number[], chats: number[]) => {
		const messages: CreateMessageDto[] = [];

		[
			'Hello everybody,',
			'Welcome to the Zoo!',
			'We hope you will enjoy your time here and please take this opportunity to send some messages',
		].forEach((msg) => {
			messages.push({
				sender_id: users[2],
				chat_id: chats[3],
				content: msg,
			});
		});

		[
			'hey!',
			'Hii!',
			'How are you?',
			'great, how are you?',
			"i'm okay. What are you doing?",
			'Just working for now.. kinda bored',
			'Wanna play some pong?',
		].forEach((msg, index) => {
			messages.push({
				sender_id: users[index % 2 === 0 ? 2 : 3],
				chat_id: chats[2],
				content: msg,
			});
		});

		[
			'Whoooo',
			'LETSGOO',
			'more meemes plez',
			'whelelalala',
			'when are we going clubbing again peepszz???',
			'WHERE AM I!??!?',
			'hey, quick question, did anyone see the last episode?',
			'of what?? ........ ',
			'You know.. of the show..',
			"Which show? I'm watching multiple..",
			'dude...',
			'dudette..',
			'wtf..',
			'We were all supposed to watch only 1 show...',
			'you promised!!',
		].forEach((msg, index) => {
			messages.push({
				sender_id: users[index % users.length],
				chat_id: chats[0],
				content: msg,
			});
		});

		['hi', 'hi', 'hi!', 'hi!'].forEach((msg, index) => {
			messages.push({
				sender_id: users[index % 2 === 0 ? 2 : 1],
				chat_id: chats[1],
				content: msg,
			});
		});

		return messages;
	},
};

export default seedData;
