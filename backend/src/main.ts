import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalValidationPipeOptions } from './main.validationpipe';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	/*
		whitelist: strips property values that do not exist in the expected DTO (DTO acts as a whitelist)
		transform: transforms the plain js object to the actual DTO class (performs string to number conversions etc)
		forbidNonWhitelisted: throw an error if any non-whitelisted property is present in the incoming object (<--- do we want this?)
	*/
	app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
	await app.listen(3000);
}
bootstrap();
