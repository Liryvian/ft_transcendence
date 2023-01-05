import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../../typeorm/typeorm.service';
import { GameInvite } from './entities/game-invite.entity';
import { GameInvitesController } from './game-invite.controller';
import { GameInvitesService } from './game-invite.service';

describe('GameInvite unit tests', () => {
	let service: GameInvitesService;
	let controller: GameInvitesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([GameInvite]),
			],
			providers: [GameInvitesService],
			controllers: [GameInvitesController],
		}).compile();

		service = module.get<GameInvitesService>(GameInvitesService);
		controller = module.get<GameInvitesController>(GameInvitesController);
	});

	it('should be defined, service and controller', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});
});
