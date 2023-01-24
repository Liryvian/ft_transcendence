import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalModule } from '../test_example/animal.module';
import { AnimalEntity } from '../test_example/entities/animals.entity';
import { SeederService } from './seeders.service';

@Module({
	imports: [TypeOrmModule.forFeature([AnimalEntity]), AnimalModule],
	providers: [SeederService],
})
export class SeedersModule {}
