import { Module } from '@nestjs/common';
import { GameInvitesService } from './game-invites.service';
import { GameInvitesController } from './game-invites.controller';

@Module({
  controllers: [GameInvitesController],
  providers: [GameInvitesService]
})
export class GameInvitesModule {}
