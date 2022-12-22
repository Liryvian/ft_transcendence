import { Module } from '@nestjs/common';
import { MembershipStateService } from './membership-state.service';
import { MembershipStateController } from './membership-state.controller';
import { MembershipState } from './entities/membership-state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipState]), AuthModule],
  controllers: [MembershipStateController],
  providers: [MembershipStateService],
})
export class MembershipStateModule {}
