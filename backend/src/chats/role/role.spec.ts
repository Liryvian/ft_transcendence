// import { Test, TestingModule } from '@nestjs/testing';
// import { RoleController } from './role.controller';
// import { RoleService } from './role.service';
// import { CreateRoleDto } from './dto/create-role.dto';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
// import { Role } from './entities/role.entity';
// import { UserModule } from '../../users/user/user.module';
// import { AuthModule } from '../../auth/auth.module';
// import { SharedModule } from '../../shared/shared.module';
// import { AnimalModule } from '../../test_example/animal.module';
// import { ChatModule } from '../chat/chat.module';
// import { MessageModule } from '../message/message.module';
// import { RoleModule } from './role.module';
// import { GameModule } from '../../pong/game/game.module';
// import { UserChatModule } from '../user-chat/user-chat.module';
// import { GameInvitesModule } from '../../pong/game_invite/game-invite.module';
// import { MatchmakingRequestModule } from '../../pong/matchmaking-request/matchmaking-request.module';
//
// describe('RoleController', () => {
// 	let controller: RoleController;
// 	let service: RoleService;
// 	let testModule: TestingModule;
//
// 	const testRoles: CreateRoleDto[] = [{ name: 'master' }, { name: 'philly' }];
//
// 	beforeAll(async () => {
// 		testModule = await Test.createTestingModule({
// 			imports: [
// 				ConfigModule.forRoot({ isGlobal: true }),
// 				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
// 				TypeOrmModule.forFeature([Role]),
// 				UserModule,
// 				AuthModule,
// 				SharedModule,
// 				AnimalModule,
// 				ChatModule,
// 				MessageModule,
// 				UserModule,
// 				RoleModule,
// 				GameModule,
// 				UserChatModule,
// 				GameInvitesModule,
// 				MatchmakingRequestModule,
// 			],
// 			controllers: [RoleController],
// 			providers: [RoleService],
// 		}).compile();
//
// 		controller = testModule.get<RoleController>(RoleController);
// 		service = testModule.get<RoleService>(RoleService);
//
// 		for (const roles in testRoles) {
// 			await controller.create(testRoles[roles]);
// 		}
// 	});
//
// 	it('should be defined', () => {
// 		expect(controller).toBeDefined();
// 	});
// 	afterAll(async () => {
// 		const repoOfRoles: Role[] = await controller.findAll();
// 		for (let i = 0; i < repoOfRoles.length; i++) {
// 			await controller.remove(i + 1);
// 		}
// 	});
//
// 	it('Get all Roles', async () => {
// 		const allRoles: Role[] = await controller.findAll();
// 		expect(allRoles).toHaveLength(2);
// 		for (let index = 0; index < allRoles.length; index++) {
// 			expect(allRoles).toEqual(
// 				expect.arrayContaining([
// 					expect.objectContaining({
// 						id: expect.any(Number),
// 						name: testRoles[index].name,
// 					}),
// 				]),
// 			);
// 		}
// 	});
//
// 	it('Get a specific role', async () => {
// 		const specificRole = 2;
// 		const role: Role = await controller.findOne(specificRole);
// 		expect(role.id).toBe(specificRole);
// 	});
// });
