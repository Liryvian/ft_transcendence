import { Module } from '@nestjs/common';
import { MembershipStateService } from './membership-state.service';
import { MembershipStateController } from './membership-state.controller';
import { MembershipState } from './entities/membership-state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([MembershipState])],
	controllers: [MembershipStateController],
	providers: [MembershipStateService],
})
export class MembershipStateModule {}
