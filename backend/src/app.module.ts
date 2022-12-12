import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm/typeorm.service';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService })
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

