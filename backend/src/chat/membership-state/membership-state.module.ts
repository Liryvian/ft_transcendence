import { Module } from '@nestjs/common';
import { MembershipStateService } from './membership-state.service';
import { MembershipStateController } from './membership-state.controller';

@Module({
  controllers: [MembershipStateController],
  providers: [MembershipStateService]
})
export class MembershipStateModule {}
