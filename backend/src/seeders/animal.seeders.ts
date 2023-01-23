import { Injectable } from '@nestjs/common';
import { AnimalService } from '../test_example/animal.service';
import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';
import { AnimalEntity } from '../test_example/entities/animals.entity';

@Injectable()
export class AnimalSeederService {
	inject: [AnimalService];
	constructor(private readonly animalService: AnimalService) {}

	seedAnimals: CreateAnimalDto[] = [
		{ name: 'Flamink' },
		{ name: 'Renoster' },
		{ name: 'Vaalboskat' },
	];

	async trySeed(): Promise<AnimalEntity[]> {
		// either try catch or a findAll call to check if
		//  database already contains the expected data
		try {
			await this.animalService.save(this.seedAnimals);
			const seeded: AnimalEntity[] = await this.animalService.findAll();
			return seeded;
		} catch (e) {
			console.error('Animals already seeded');
		}
	}
}
