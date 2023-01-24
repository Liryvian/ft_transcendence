import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { globalValidationPipeOptions } from './main.validationpipe';
import { SeederService } from './seeders/seeders.service';

async function bootstrap() {
	const app: INestApplication = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
	app.use(cookieParser());
	app.enableCors({
		origin: 'http://localhost:8080',
		credentials: true,
	});

	app.get<SeederService>(SeederService).seedDatabase();

	await app.listen(3000);
}
bootstrap();
