import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
const multer = require('multer');

@Global()
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
		/**
		 * Multer is a nodejs middleware for handling multipart/form-data
		 * it's primarily used for file uploads
		 *
		 * https://expressjs.com/en/resources/middleware/multer.html
		 *
		 * Here the MulterModule is registered with a disk storage device
		 * This gives us options to specify where to store uploaded files and what to do with the filename
		 *
		 * (cb() == CallBack), the function to call
		 *
		 * Destination is a function used to determine the destination to save the file
		 * Filename is a function that you can use to transform the filename
		 */
		MulterModule.registerAsync({
			useFactory: () => ({
				storage: multer.diskStorage({
					destination: function (req, file, cb) {
						if (file.fieldname === 'avatar') {
							cb(null, './public/avatars');
						} else {
							cb(null, './public');
						}
					},
					filename: function (req, file, cb) {
						if (file.fieldname === 'avatar') {
							const userId = req.originalUrl.split('/')[2];
							const ext = file.originalname.split('.') ?? 'jpg';
							const new_filename = `u${userId}_avatar.${ext.pop()}`;
							cb(null, new_filename);
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
