import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateMembershipStateDto } from '../src/chat/membership-state/dto/create-membership-state.dto';
import { MembershipStateController } from '../src/chat/membership-state/membership-state.controller';
import { MembershipState } from '../src/chat/membership-state/entities/membership-state.entity';
import { MembershipStateModule } from '../src/chat/membership-state/membership-state.module';

describe('chatroom e2e', () => {
	let app: INestApplication;
	let membershipStateController: MembershipStateController;
	const testMembershipStates: CreateMembershipStateDto[] = [
		{ name: 'Boss' },
		{ name: 'Seasnail' },
		{ name: 'NotABoss' },
	];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				MembershipStateModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();

		membershipStateController = moduleFixture.get<MembershipStateController>(
			MembershipStateController,
		);

		// seed db with animals for each testcase
		for (const membershipState in testMembershipStates) {
			await membershipStateController.create(
				testMembershipStates[membershipState],
			);
		}
	});

	afterAll(async () => {
		const allMembershipStates: MembershipState[] =
			await membershipStateController.findAll();

		for (let index = 0; index < allMembershipStates.length; index++) {
			await membershipStateController.remove(allMembershipStates[index].id);
		}
		await app.close();
	});

	describe('/membershipStates (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer())
				.get('/membership-states')
				.expect(HttpStatus.OK);
		});
	});

});
