import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import {ChatMembershipModule} from "../chat-membership.module";

@Module({
  imports: [
      ChatMembershipModule
  ],
  controllers: [AuthController]
})
export class AuthModule {}
