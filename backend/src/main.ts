import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());
	app.enableCors({
		origin: 'http://localhost:8080',
		credentials: true,
	});
	await app.listen(3000);
}
bootstrap();
