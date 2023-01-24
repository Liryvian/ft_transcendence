import { Injectable } from '@nestjs/common';
import { AnimalService } from '../test_example/animal.service';
import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';
import * as fs from 'fs';
import seedData from './seed.data';

@Injectable()
export class SeederService {
	inject: [AnimalService];

	constructor(private readonly animalService: AnimalService) {}

	shouldSeed(): boolean {
		const shouldSeedFilePath = './dist/src/seeders/.hasSeeded';
		if (fs.existsSync(shouldSeedFilePath)) {
			return false;
		} else {
			fs.writeFileSync(shouldSeedFilePath, '');
			return true;
		}
	}

	async seedDatabase() {
		if (!this.shouldSeed()) return;

		await this.animalService.trySeed(seedData.animals());
	}
}
