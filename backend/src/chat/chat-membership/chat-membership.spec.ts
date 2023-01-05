import { Test, TestingModule } from '@nestjs/testing';
import { ChatMembershipController } from './chat-membership.controller';
import { ChatMembershipService } from './chat-membership.service';
import { ChatMembership } from './entities/chat-membership.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';

describe('ChatMembershipController', () => {
	let controller: ChatMembershipController;
	let service: ChatMembershipService;
	let testingModule: TestingModule;

	// const testMemberships = ['1', '2', '3'];

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
		controller = testingModule.get<ChatMembershipController>(
			ChatMembershipController,
		);
		service = testingModule.get<ChatMembershipService>(ChatMembershipService);

		// seed db with testmemberships
		//use controller instance to put data in the db
		// for (const membership in testMemberships) {
		// 	await controller.create({ chat_id: testMemberships[membership] });
		// }
	});

	//// delete all data in db for each test
	// afterAll(async () => {
	// 	// let repoOfAnimals = await controller.findAll(); note: this is in the written repo, below is in your example, what is the difference?
	// 	const repoOfChatMemberships: ChatMembership[] = await controller.findAll();
	// 	for (let i = 0; i < repoOfChatMemberships.length; i++) {
	// 		await controller.remove(i + 1); // do we do remove or delete or doesn't it matter?
	// 	}
	// });

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
