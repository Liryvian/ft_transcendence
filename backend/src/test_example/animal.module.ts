import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalEntity } from './entities/animals.entity';

@Module({
	imports: [TypeOrmModule.forFeature([AnimalEntity])],
	controllers: [AnimalController],
	providers: [AnimalService],
	exports: [AnimalService],
})
export class AnimalModule {}
