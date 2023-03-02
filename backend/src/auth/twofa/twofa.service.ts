import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user/user.service';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { authenticator } from 'otplib';
import { TwoFaDto } from './dto/twofa.dto';

// we might want to consider encrypting/decrypting the secret
// instead of saving it plaintext into the db
//
// import { scrypt, randomFill, createCipheriv } from 'crypto';
// https://nodejs.org/api/crypto.html#class-cipher
//

@Injectable()
export class TwoFaService {
	constructor(
		private userService: UserService,
		private configService: ConfigService,
	) {}

	async generateSecret() {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri('userName', 'liryvianPong', secret);

		const qr = await QRCode.toDataURL(otpauthUrl)
			.then((url) => {
				return url;
			})
			.catch((err) => {
				// not sure how to handle this or how this errors..
				console.error(err);
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
