import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { globalValidationPipeOptions } from './main.validationpipe';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
	app.use(cookieParser());
	app.enableCors({
		origin: '*',
		credentials: true,
		allowedHeaders: [
			'Access-Constrol-Allow-Origin', //or the specific origin you want to give access to,
			'Access-Control-Allow-Credentials',
			'Access-Control-Allow-Headers',
		],
	});
	await app.listen(3000);
}
bootstrap();
