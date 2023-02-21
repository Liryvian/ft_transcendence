import { forwardRef, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Game]),
		forwardRef(() => AuthModule),
		SharedModule,
	],
	controllers: [GameController],
	providers: [GameService],
	exports: [GameService],
})
export class GameModule {}
