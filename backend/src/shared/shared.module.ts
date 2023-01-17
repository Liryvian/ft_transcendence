import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
const multer = require('multer');

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('SECRET'),
				signOptions: { expiresIn: '1d' },
			}),
			inject: [ConfigService],
		}),
		MulterModule.registerAsync({
			useFactory: () => ({
				storage: multer.diskStorage({
					destination: function (req, file, cb) {
						cb(null, './public');
					},
					filename: function (req, file, cb) {
						const avatarRegex = new RegExp('^/users/[0-9]+/avatar[/]?$');
						if (avatarRegex.test(req.originalUrl)) {
							const parts = file.originalname.split('.');
							const ext = parts.pop();
							let filename: string;
							if (parts.length > 1) {
								filename = parts.join('.');
							} else {
								filename = parts.join('');
							}
							filename += '_a' + req.originalUrl.split('/')[2];
							cb(null, '/avatars/' + filename + '.' + ext);
							return;
						}
						cb(null, file.originalname);
					},
				}),
			}),
		}),
	],
	exports: [JwtModule, MulterModule],
})
export class SharedModule {}
