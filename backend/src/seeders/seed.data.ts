import { CreateAnimalDto } from '../test_example/dto/create-animal.dto';

const seedData = {
	animals: () => {
		const animalSeeds: CreateAnimalDto[] = [
			{ name: 'Flamink' },
			{ name: 'Renoster' },
			{ name: 'Vaalboskat' },
		];
		return animalSeeds;
	},
};

export default seedData;
