import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../shared/test.module';
import { AnimalSeederService } from './animal.seeders';

describe('AnimalSeederService', () => {
	let service: AnimalSeederService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = module.get<AnimalSeederService>(AnimalSeederService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
