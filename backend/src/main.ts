import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	app.use(cookieParser());
	app.enableCors({
		origin: 'http://localhost:8080',
		credentials: true,
	});
	await app.listen(3000);
}
bootstrap();
