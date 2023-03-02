import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { authenticator } from 'otplib';
import { TwoFaDto } from './dto/twofa.dto';

@Injectable()
export class TwoFaService {
	async generateSecret() {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri('userName', 'liryvianPong', secret);

		const qr = await QRCode.toDataURL(otpauthUrl)
			.then((url) => {
				return url;
			})
			.catch((err) => {
				return '';
			});

		return {
			qr,
			secret,
		};
	}

	verify2faCode(twoFaDto: TwoFaDto) {
		try {
			const isValid = authenticator.check(twoFaDto.token, twoFaDto.secret);
			return isValid;
		} catch (e) {
			console.log(e);
		}
		return false;
	}
}
