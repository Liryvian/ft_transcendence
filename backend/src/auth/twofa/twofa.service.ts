import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user/user.service';
import * as crypto from 'crypto';
import QRCode from 'qrcode';
import { totp } from 'otplib';

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

	generateSecret() {
		console.log({ secret: crypto.pseudoRandomBytes(6).toString('hex') });
	}
}
