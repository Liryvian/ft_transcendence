import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAnimalDto } from '../src/test_example/dto/create-animal.dto';
import { AnimalController } from '../src/test_example/animal.controller';
import { UpdateAnimalDto } from '../src/test_example/dto/update-animal.dto';
import { AnimalEntity } from '../src/test_example/entities/animals.entity';
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { AllTestingModule } from '../src/shared/test.module';
import { AnimalModule } from '../src/test_example/animal.module';
import { AnimalService } from '../src/test_example/animal.service';
import seedData from '../src/seeders/seed.data';

describe('AnimalController (e2e)', () => {
	let app: INestApplication;
	let animalController: AnimalController;
	let animalService: AnimalService;

	const mockAnimal: CreateAnimalDto = { name: 'Ystervarkie' };

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule, AnimalModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		animalController = moduleFixture.get<AnimalController>(AnimalController);
		animalService = moduleFixture.get<AnimalService>(AnimalService);

		// seed db with animals for each testcase
		await animalService.trySeed(seedData.animals());
	});

	afterAll(async () => {
		const allAnimals: AnimalEntity[] = await animalController.findAll();

		for (let index = 0; index < allAnimals.length; index++) {
			await animalController.remove(allAnimals[index].id);
		}
		app.close();
	});

	describe('/test (GET)', () => {
		it('should return an array of all animals', () => {
			return request(app.getHttpServer()).get('/test').expect(HttpStatus.OK);
		});
	});

	describe('/test/:id (GET)', () => {
		it('should return an animal', () => {
			const animalId = 3;
			const expected: string = seedData.animals()[2].name;
			return request(app.getHttpServer())
				.get('/test/' + animalId)
				.expect(HttpStatus.OK)
				.expect((response: request.Response) => {
					const { id, name } = response.body;
					expect(typeof id).toBe('number'), expect(name).toEqual(expected);
				});
		});

		it('should return a 404 for non-existant entry', () => {
			const nonExistantId = 10000;

			return request(app.getHttpServer())
				.get('/test/' + nonExistantId)
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('/test (POST)', () => {
		it('should return the id of the created animal', () => {
			return request(app.getHttpServer())
				.post('/test')
				.set('Accept', 'application/json')
				.send(mockAnimal)
				.expect(HttpStatus.CREATED)
				.expect((response: request.Response) => {
					const id = response.body;
					expect(id.length).toBe(1);
					expect(typeof id).toBe('object');
					expect(typeof id[0].id).toBe('number');
				});
		});

		it('should return 400 on posting an incomplete animal', () => {
			const incompleteAnimal: CreateAnimalDto = { name: '' };
			return request(app.getHttpServer())
				.post('/test')
				.set('Accept', 'application/json')
				.send(incompleteAnimal)
				.expect(HttpStatus.BAD_REQUEST);
		});

		it('should return 400 on posting an empty animal', () => {
			const emptyAnimal = {};
			return request(app.getHttpServer())
				.post('/test')
				.set('Accept', 'application/json')
				.send(emptyAnimal)
				.expect(HttpStatus.BAD_REQUEST);
		});

		//  Example of a custom return in controller, not part of abstract class tests
		it('should return 409 on posting a duplciate animal', () => {
			return request(app.getHttpServer())
				.post('/test')
				.set('Accept', 'application/json')
				.send(mockAnimal)
				.expect(HttpStatus.CONFLICT);
		});
	});

	describe('/test/:id  (DELETE)', () => {
		it('should delete an animal', () => {
			const id = 1;
			return request(app.getHttpServer())
				.delete('/test/' + id)
				.expect(HttpStatus.OK);
		});

		it('should still return OK even if non-existant entry', () => {
			const id = 10000;
			return request(app.getHttpServer())
				.delete('/test/' + id)
				.expect(HttpStatus.OK);
		});
	});

	describe('/test/:id (PATCH)', () => {
		it('update animal with id 2', () => {
			const ValidId = 2;
			const updateData: UpdateAnimalDto = { name: 'Nagapie' };
			return request(app.getHttpServer())
				.patch('/test/' + ValidId)
				.set('Accept', 'application/json')
				.send(updateData)
				.expect(HttpStatus.OK)
				.expect((response: request.Response) => {
					const { affected } = response.body;
					expect(affected).toEqual(1);
				});
		});

		it('should return not found if non-existant', () => {
			const nonExistantId = 10000;
			const updateData: UpdateAnimalDto = { name: 'Nagapie' };
			return request(app.getHttpServer())
				.patch('/test/' + nonExistantId)
				.set('Accept', 'application/json')
				.send(updateData)
				.expect(HttpStatus.NOT_FOUND);
		});
	});

	describe('/test/bulk (POST)', () => {
		it('should create multiple entries', () => {
			const data = [{ name: '__n1' }, { name: '__n2' }];
			return request(app.getHttpServer())
				.post('/test/bulk')
				.set('Accept', 'application/json')
				.send(data)
				.expect(HttpStatus.CREATED)
				.expect((response: request.Response) => {
					const result = response.body;
					expect(result.length).toBe(2);
				});
		});

		it('should fail on invalid DTO for multiple entries', () => {
			const invalidData = [{ name: '__n1' }, { name: '__n2', foo: 'bar' }];
			return request(app.getHttpServer())
				.post('/test/bulk')
				.set('Accept', 'application/json')
				.send(invalidData)
				.expect(HttpStatus.BAD_REQUEST);
		});
	});

	describe('/test/bulk/:ids (DELETE)', () => {
		it('should delete multiple exsisting entries', async () => {
			const toDelete = await animalController.createBulk([
				{ name: '__d1' },
				{ name: '__d2' },
			]);
			const ids = toDelete.map((obj) => obj.id);
			return request(app.getHttpServer())
				.delete('/test/bulk')
				.set('Accept', 'application/json')
				.send(ids)
				.expect(HttpStatus.OK);
		});
	});
});
