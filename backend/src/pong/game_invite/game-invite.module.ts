import { forwardRef, Module } from '@nestjs/common';
import { GameInvitesService } from './game-invite.service';
import { GameInvitesController } from './game-invite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameInvite } from './entities/game-invite.entity';
import { AuthModule } from '../../auth/auth.module';
import { SharedModule } from '../../shared/shared.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([GameInvite]),
		forwardRef(() => AuthModule),
		SharedModule,
	],
	controllers: [GameInvitesController],
	providers: [GameInvitesService],
	exports: [GameInvitesService],
})
export class GameInvitesModule {}
