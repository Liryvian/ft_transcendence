import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user/user.module';
import { SocketService } from './socket.service';

@Module({
	imports: [AuthModule, UserModule],
	controllers: [],
	providers: [SocketService],
	exports: [SocketService],
})
export class SocketModule {}
