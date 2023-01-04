import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimalModule } from './test_example/animal.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
			TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
		AnimalModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
