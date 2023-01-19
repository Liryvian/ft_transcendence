import { Module } from '@nestjs/common';
import { GameInvitesService } from './game-invite.service';
import { GameInvitesController } from './game-invite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameInvite } from './entities/game-invite.entity';

@Module({
	imports: [TypeOrmModule.forFeature([GameInvite])],
	controllers: [GameInvitesController],
	providers: [GameInvitesService],
	exports: [GameInvitesService],
})
export class GameInvitesModule {}
