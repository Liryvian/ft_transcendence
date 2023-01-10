import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalValidationPipeOptions } from './main.validationpipe';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
	await app.listen(3000);
}
bootstrap();
