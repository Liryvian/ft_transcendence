import { Module } from '@nestjs/common';
import { TwoFaService } from './twofa.service';

@Module({
	imports: [],
	controllers: [],
	providers: [TwoFaService],
	exports: [TwoFaService],
})
export class AuthModule {}
