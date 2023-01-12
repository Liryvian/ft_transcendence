import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';

@Module({
	imports: [forwardRef(() => UserModule), SharedModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthModule],
})
export class AuthModule {}
