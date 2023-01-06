import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';

import { CreateMembershipStateDto } from './dto/create-membership-state.dto';
import { MembershipStateController } from './membership-state.controller';
import { MembershipStateService } from './membership-state.service';
import { MembershipState } from './entities/membership-state.entity';

describe('MembershipStateController', () => {
	let membershipController: MembershipStateController;
	let service: MembershipStateService;
	let testingModule: TestingModule;

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
				TypeOrmModule.forFeature([MembershipState]),
			],
			controllers: [MembershipStateController],
			providers: [MembershipStateService],
		}).compile();

		membershipController = testingModule.get<MembershipStateController>(
			MembershipStateController,
		);
		service = testingModule.get<MembershipStateService>(MembershipStateService);

		for (const membershipState in testMembershipStates) {
			await membershipController.create(testMembershipStates[membershipState]);
		}
	});

	afterAll(async () => {
		const repoOfMembershipStates: MembershipState[] =
			await membershipController.findAll();
		for (let i = 0; i < repoOfMembershipStates.length; i++) {
			await membershipController.remove(i + 1);
		}
	});

	it('Get all MembershipStates', async () => {
		const allMembershipStates: MembershipState[] =
			await membershipController.findAll();
		expect(allMembershipStates).toHaveLength(3);
		for (let index = 0; index < allMembershipStates.length; index++) {
			expect(allMembershipStates).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						name: testMembershipStates[index].name,
					}),
				]),
			);
		}
	});

	it('Get a specific membership-state', async () => {
		const specificMembershipState = 3;
		const membershipState: MembershipState = await membershipController.findOne(
			specificMembershipState,
		);
		expect(membershipState.id).toBe(specificMembershipState);
	});
});
