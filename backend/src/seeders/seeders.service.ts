import { Injectable } from '@nestjs/common';
import { AnimalService } from '../test_example/animal.service';
import * as fs from 'fs';
import seedData from './seed.data';

@Injectable()
export class SeederService {
	inject: [AnimalService];

	constructor(private readonly animalService: AnimalService) {}

	private readonly shouldSeedFilePath = './dist/src/seeders/.hasSeeded';

	shouldSeed(): boolean {
		if (fs.existsSync(this.shouldSeedFilePath)) {
			return false;
		}
		return true;
	}

	finilizeSeeding() {
		fs.writeFileSync(this.shouldSeedFilePath, '');
	}

	async seedDatabase() {
		if (!this.shouldSeed()) return;

		await this.animalService.trySeed(seedData.animals());

		this.finilizeSeeding();
	}
}
