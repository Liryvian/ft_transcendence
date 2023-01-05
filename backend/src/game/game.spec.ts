import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectLiteral } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameService', () => {
	let service: GameService;
	let controller: GameController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([Game]),
			],
			controllers: [GameController],
			providers: [GameService],
		}).compile();

		service = module.get<GameService>(GameService);
		controller = module.get<GameController>(GameController);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
		expect(controller).toBeDefined();
	});
});
