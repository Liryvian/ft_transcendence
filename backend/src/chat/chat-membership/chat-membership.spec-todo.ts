import { Test, TestingModule } from '@nestjs/testing';
import { ChatMembershipController } from './chat-membership.controller';
import { ChatMembershipService } from './chat-membership.service';
import { ChatMembership } from './entities/chat-membership.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { ChatroomController } from '../chatroom/chatroom.controller';
import { ChatroomService } from '../chatroom/chatroom.service';
import { MembershipStateController } from '../membership-state/membership-state.controller';
import { MembershipStateService } from '../membership-state/membership-state.service';
import { CreateChatroomDto } from '../chatroom/dto/create-chatroom.dto';
import { CreateMembershipStateDto } from '../membership-state/dto/create-membership-state.dto';
import { MembershipState } from '../membership-state/entities/membership-state.entity';
import { Message } from '../message/entities/message.entity';

describe('ChatMembershipController', () => {
	let chatMembershipController: ChatMembershipController;
	let chatMembershipService: ChatMembershipService;
	let chatroomController: ChatroomController;
	let chatroomService: ChatroomService;
	let membershipStateController: MembershipStateController;
	let membershipStateService: MembershipStateService;
	let testingModule: TestingModule;

	const testChatMemberships = [{},{},{}];

	const testChatrooms: CreateChatroomDto[] = [
		{ name: 'A', visibility: 'Not', password: 'A' },
		{ name: 'B', visibility: 'Yes', password: 'B' },
	];

	const testMembershipStates: CreateMembershipStateDto[] = [
		{ name: 'Boss' },
		{ name: 'Seasnail' },
		{ name: 'NotABoss' },
	];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([ChatMembership]), // note: I think rhyno call the entity class for example AnimalEntity, I only have animal, do you have e preference?
			],
			controllers: [ChatMembershipController],
			providers: [ChatMembershipService],
		}).compile();

		//get instance of a service or a controller you'd like to test
		chatMembershipController = testingModule.get<ChatMembershipController>(
			ChatMembershipController,
		);
		chatMembershipService = testingModule.get<ChatMembershipService>(
			ChatMembershipService,
		);
		chatroomController =
			testingModule.get<ChatroomController>(ChatroomController);

		chatroomService = testingModule.get<ChatroomService>(ChatroomService);

		membershipStateController = testingModule.get<MembershipStateController>(
			MembershipStateController,
		);
		membershipStateService = testingModule.get<MembershipStateService>(
			MembershipStateService,
		);

		// seed db with testmemberships
		//use controller instance to put data in the db

		for (const chatroom in testChatrooms) {
			await chatroomController.create(testChatrooms[chatroom]);
		}

		for (const membershipState in testMembershipStates) {
			await membershipStateController.create(
				testMembershipStates[membershipState],
			);
		}

		for (const chatMembership in testChatMemberships) {
			await chatMembershipController.create(
				testChatMemberships[chatMembership],
			);
		}
	});

	afterAll(async () => {
		const repoOfMembershipStates: MembershipState[] =
			await chatMembershipController.findAll();
		for (let i = 0; i < repoOfMembershipStates.length; i++) {
			await chatMembershipController.remove(i + 1);
		}
	});

	it('should be defined', () => {
		expect(chatMembershipController).toBeDefined();
		expect(chatMembershipService).toBeDefined();
	});

	it('Get all MembershipStates', async () => {
		const allChatmemberships: ChatMembership[] = await chatMembershipController.findAll();
		expect(allChatmemberships).toHaveLength(2);
		console.log(allChatmemberships);
		console.table(allChatmemberships);
		for (let index = 0; index < allChatmemberships.length; index++) {
			expect(allChatmemberships).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						chat_id: expect.objectContaining({
							chat_id: testChatMemberships[index].chat_id,
						}),
						membership_id: expect.objectContaining({
							id: testChatMemberships[index].membership_id,
						}),
					}),
				]),
			);
		}
	});

	it('Get a specific membership-state', async () => {
		const specificChatMembership = 3;
		const chatMembership: ChatMembership =
			await chatMembershipController.findOne(specificChatMembership);
		expect(chatMembership.id).toBe(specificChatMembership);
	});
});
