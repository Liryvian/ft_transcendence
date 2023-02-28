import { Module } from '@nestjs/common';
import { UserModule } from '../../users/user/user.module';
import { TwoFaService } from './twofa.service';

@Module({
	imports: [UserModule],
	controllers: [],
	providers: [TwoFaService],
	exports: [TwoFaService],
})
export class TwoFaModule {}
