import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StatusGateway } from '../users/user/user-status.gateway';
import { UserModule } from '../users/user/user.module';
import { SocketService } from './socket.service';

@Module({
	imports: [AuthModule, UserModule],
	controllers: [],
	providers: [SocketService, StatusGateway],
	exports: [SocketService, StatusGateway],
})
export class SocketModule {}
