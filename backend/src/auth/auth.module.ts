import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user/user.module';
import { TwoFaModule } from './twofa/twofa.module';

@Module({
	imports: [forwardRef(() => UserModule), TwoFaModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
