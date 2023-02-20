import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user/user.module';

@Module({
	imports: [forwardRef(() => UserModule)],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthModule],
})
export class AuthModule {}
