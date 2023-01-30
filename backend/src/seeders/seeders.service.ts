import { Injectable } from '@nestjs/common';
import { AnimalService } from '../test_example/animal.service';
import * as fs from 'fs';
import seedData from './seed.data';

@Injectable()
export class SeederService {
	inject: [AnimalService];

	constructor(private readonly animalService: AnimalService) {}

	private readonly shouldSeedFilePath = './dist/seeders/.hasSeeded';

	shouldSeed(): boolean {
		return fs.existsSync(this.shouldSeedFilePath) === false;
	}

	finilizeSeeding() {
		fs.writeFileSync(this.shouldSeedFilePath, '');
	}

	async seedDatabase() {
		if (this.shouldSeed()) {
			await this.animalService.trySeed(seedData.animals());
			this.finilizeSeeding();
		}
	}
}
