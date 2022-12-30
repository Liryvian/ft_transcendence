import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../shared/abstract.service';
import { Repository } from 'typeorm';
import { AnimalEntity } from './entities/animals.entity';

@Injectable()
export class AnimalService extends AbstractService<AnimalEntity> {
	constructor(
		@InjectRepository(AnimalEntity)
		private readonly animalRepo: Repository<AnimalEntity>,
	) {
		super(animalRepo);
	}

	pagination(): String {
		return '15 animals';
	}
}
