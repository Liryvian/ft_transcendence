import { Module } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Animal])],
  controllers: [AnimalController],
  providers: [AnimalService]
})
export class TestExampleModule {}
