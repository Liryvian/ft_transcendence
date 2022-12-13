import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './typeorm/typeorm.service';
import { AnimalModule } from './test_example/animal.module';
import { TypeORmTestingModule } from './test_example/databaseForTesting/TypeORMTestingModule';

let dbClass;
if (process.env.TEST === "1")
	dbClass = TypeORmTestingModule;
else
	dbClass = TypeOrmConfigService;
console.log(process.env.TEST);

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
			TypeOrmModule.forRootAsync({ useClass: dbClass }),
		AnimalModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
