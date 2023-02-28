import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user/user.service';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import { authenticator, totp } from 'otplib';

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

		const qr = await QRCode.toDataURL(
			`otpauth://totp/LiryvianPong:user?secret=${secret}&period=30&digits=6&algorithm=SHA1&issuer=LiryvianPong`,
		)
			.then((url) => {
				return url;
			})
			.catch((err) => {
				// not sure how to handle this or how this errors..
				console.error(err);
			});

		return {
			qr,
			secret,
		};
	}
}
