import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';
import { CreateChatDto } from '../chats/chat/dto/create-chat.dto';
import { CreateUserRelationshipDto } from '../users/user-relationship/dto/create-user-relationship.dto';
import { validRelationships } from '../users/user-relationship/entities/user-relationship.entity';
import * as bcrypt from 'bcrypt';
import { CreateChatUserPermissionDto } from '../chats/chat-user-permissions/dto/create-chat-user-permission.dto';
import { CreateUserAchievementDto } from '../users/user-achievements/dto/create-user-achievement.dto';
import { permissionsEnum } from '../chats/chat-user-permissions/entities/chat-user-permission.entity';
import { gameStates } from '../pong/game/entities/game.entity';

class seedUser {
	name: string;
	password?: string;
	is_intra: boolean;
	avatar?: string;
	created_at?: string;
	updated_at?: string;
}

class seedGame {
	player_one: number;
	player_two: number;
	score_player_one: number;
	score_player_two: number;
	state: gameStates;
}

class seedMessage {
	sender_id: number;
	chat: number;
	content: string;
	created_at?: string;
	updated_at?: string;
}

const date_source = new Date();
date_source.setDate(date_source.getDate() - 1);
const user_dates: string[] = [
	new Date(date_source.setHours(6, 14, 32)).toISOString(),
	new Date(date_source.setHours(6, 18, 45)).toISOString(),
	new Date(date_source.setHours(6, 32, 8)).toISOString(),
	new Date(date_source.setHours(6, 59, 12)).toISOString(),
	new Date(date_source.setHours(7, 11, 12)).toISOString(),
];

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
				created_at: user_dates[0],
				updated_at: user_dates[0],
			},
			{
				name: 'flamink',
				password: await bcrypt.hash('f', 11),
				is_intra: false,
				avatar: 'seeded_profile_flamink.png',
				created_at: user_dates[1],
				updated_at: user_dates[1],
			},
			{
				name: 'renoster',
				password: await bcrypt.hash('r', 11),
				is_intra: false,
				avatar: 'seeded_profile_renoster.png',
				created_at: user_dates[2],
				updated_at: user_dates[2],
			},
			{
				name: 'vaalboskat',
				password: await bcrypt.hash('v', 11),
				is_intra: false,
				avatar: 'seeded_profile_vaalboskat.png',
				created_at: user_dates[3],
				updated_at: user_dates[3],
			},
			{
				name: 'wildsbok',
				password: await bcrypt.hash('w', 11),
				is_intra: false,
				created_at: user_dates[4],
				updated_at: user_dates[4],
			},
		];
		return users;
	},

	userRelations: (ids: number[]) => {
		const userRelations: CreateUserRelationshipDto[] = [
			{
				source: ids[0],
				target: ids[1],
				type: validRelationships.FRIEND,
				specifier_id: ids[0],
			},
			{
				source: ids[0],
				target: ids[2],
				type: validRelationships.FRIEND,
				specifier_id: ids[0],
			},
			{
				source: ids[0],
				target: ids[3],
				type: validRelationships.FRIEND,
				specifier_id: ids[0],
			},
			{
				source: ids[1],
				target: ids[2],
				type: validRelationships.FRIEND,
				specifier_id: ids[1],
			},
			{
				source: ids[1],
				target: ids[3],
				type: validRelationships.FRIEND,
				specifier_id: ids[1],
			},
			{
				source: ids[0],
				target: ids[4],
				type: validRelationships.BLOCKED,
				specifier_id: ids[0],
			},
			{
				source: ids[3],
				target: ids[4],
				type: validRelationships.BLOCKED,
				specifier_id: ids[3],
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
				state: gameStates.DONE,
			},
			{
				player_one: ids[1],
				player_two: ids[2],
				score_player_one: 8,
				score_player_two: 3,
				state: gameStates.DONE,
			},
			{
				player_one: ids[2],
				player_two: ids[0],
				score_player_one: 12,
				score_player_two: 7,
				state: gameStates.DONE,
			},
			{
				player_one: ids[3],
				player_two: ids[2],
				score_player_one: 4,
				score_player_two: 10,
				state: gameStates.DONE,
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
			{ name: 'Zzz sleepy', type: 'channel', visibility: 'public' },
		];
		return chats;
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

	chatUserPermission: (users, chats) => {
		const cups: CreateChatUserPermissionDto[] = [];

		const aardwolf = users.find((u) => u.name === 'aardwolf').id;
		const flamink = users.find((u) => u.name === 'flamink').id;
		const renoster = users.find((u) => u.name === 'renoster').id;
		const vaalboskat = users.find((u) => u.name === 'vaalboskat').id;
		const wildsbok = users.find((u) => u.name === 'wildsbok').id;

		const desert = chats.find((c) => c.name === 'Desert').id;
		const flaminkRenoster = chats.find((c) => c.name === 'flamink-renoster').id;
		const vaalboskatRenoster = chats.find(
			(c) => c.name === 'vaalboskat-renoster',
		).id;
		const zoo = chats.find((c) => c.name === 'Zoo').id;
		const zzzSleepy = chats.find((c) => c.name === 'Zzz sleepy').id;

		// Add flamink and renoster to their DM
		[permissionsEnum.POST, permissionsEnum.READ, permissionsEnum.OWNER].forEach(
			(p) => {
				[flamink, renoster].forEach((u) => {
					cups.push({
						chat_id: flaminkRenoster,
						user_id: u,
						permission: p,
					});
				});
			},
		);

		// Add vaalboskat and renoster to their DM
		[permissionsEnum.POST, permissionsEnum.READ, permissionsEnum.OWNER].forEach(
			(p) => {
				[vaalboskat, renoster].forEach((u) => {
					cups.push({
						chat_id: vaalboskatRenoster,
						user_id: u,
						permission: p,
					});
				});
			},
		);

		// make renoster admin of Desert
		[
			permissionsEnum.EDIT_SETTINGS,
			permissionsEnum.MANAGE_USERS,
			permissionsEnum.POST,
			permissionsEnum.OWNER,
		].forEach((p) => {
			cups.push({
				chat_id: desert,
				user_id: renoster,
				permission: p,
			});
		});

		// add almost everybody with all permissions to 'Zoo'
		[
			permissionsEnum.EDIT_SETTINGS,
			permissionsEnum.MANAGE_USERS,
			permissionsEnum.POST,
			permissionsEnum.READ,
		].forEach((p) => {
			[aardwolf, flamink, renoster, vaalboskat].forEach((u) => {
				cups.push({
					chat_id: zoo,
					user_id: u,
					permission: p,
				});
			});
		});
		// add flamink as owner of zoo
		cups.push({
			chat_id: zoo,
			user_id: flamink,
			permission: permissionsEnum.OWNER,
		});

		// add almost everybody to 'Desert' with read permission
		[aardwolf, flamink, renoster, vaalboskat]
			.map(
				(u) =>
					({
						chat_id: desert,
						user_id: u,
						permission: permissionsEnum.READ,
					} as CreateChatUserPermissionDto),
			)
			.forEach((cup) => cups.push(cup));

		// add wildsbok user blocked + left to every chat
		[desert, zoo]
			.map((c) => ({
				chat_id: c,
				user_id: wildsbok,
				permission: permissionsEnum.BLOCKED,
			}))
			.forEach((cup) => cups.push(cup));
		[desert, zoo]
			.map((c) => ({
				chat_id: c,
				user_id: wildsbok,
				permission: permissionsEnum.LEFT,
			}))
			.forEach((cup) => cups.push(cup));

		// add wildsbok to Zzz sleepy channel
		cups.push({
			chat_id: zzzSleepy,
			user_id: wildsbok,
			permission: permissionsEnum.POST,
		});
		cups.push({
			chat_id: zzzSleepy,
			user_id: wildsbok,
			permission: permissionsEnum.READ,
		});
		return cups;
	},

	messages: (users, chats) => {
		const messages: seedMessage[] = [];

		const aardwolf = users.find((u) => u.name === 'aardwolf').id;
		const flamink = users.find((u) => u.name === 'flamink').id;
		const renoster = users.find((u) => u.name === 'renoster').id;
		const vaalboskat = users.find((u) => u.name === 'vaalboskat').id;

		const desert = chats.find((c) => c.name === 'Desert').id;
		const flaminkRenoster = chats.find((c) => c.name === 'flamink-renoster').id;
		const vaalboskatRenoster = chats.find(
			(c) => c.name === 'vaalboskat-renoster',
		).id;
		const zoo = chats.find((c) => c.name === 'Zoo').id;

		[
			'Hello everybody,',
			'Welcome to the Zoo!',
			'We hope you will enjoy your time here and please take this opportunity to send some messages',
		].forEach((msg, index) => {
			messages.push({
				sender_id: renoster,
				chat: zoo,
				content: msg,
				created_at: new Date(
					date_source.setHours(8, 12 + index, 0),
				).toISOString(),
				updated_at: new Date(
					date_source.setHours(8, 12 + index, 0),
				).toISOString(),
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
				sender_id: [vaalboskat, renoster][index % 2 === 0 ? 0 : 1],
				chat: vaalboskatRenoster,
				content: msg,
				created_at: new Date(
					date_source.setHours(9, 2 + index, 0),
				).toISOString(),
				updated_at: new Date(
					date_source.setHours(9, 2 + index, 0),
				).toISOString(),
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
				sender_id: [aardwolf, flamink, renoster, vaalboskat][index % 4],
				chat: desert,
				content: msg,
				created_at: new Date(
					date_source.setHours(10, 25 + index * 2, 0),
				).toISOString(),
				updated_at: new Date(
					date_source.setHours(10, 25 + index * 2, 0),
				).toISOString(),
			});
		});

		['hi', 'hi', 'hi!', 'hi!'].forEach((msg, index) => {
			messages.push({
				sender_id: [flamink, renoster][index % 2 === 0 ? 0 : 1],
				chat: flaminkRenoster,
				content: msg,
				created_at: new Date(
					date_source.setHours(11, 48 + index, 0),
				).toISOString(),
				updated_at: new Date(
					date_source.setHours(11, 48 + index, 0),
				).toISOString(),
			});
		});

		return messages;
	},
};

export default seedData;
