import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { globalValidationPipeOptions } from './main.validationpipe';
import { AnimalSeederService } from './seeders/animal.seeders';

async function seedDatabase(app: INestApplication) {
	const animalSeeder = app.get<AnimalSeederService>(AnimalSeederService);
	await animalSeeder.trySeed();
}


async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
	app.use(cookieParser());
	app.enableCors({
		origin: 'http://localhost:8080',
		credentials: true,
	});
	seedDatabase(app);
	await app.listen(3000);
}
bootstrap();
