import { Test, TestingModule } from '@nestjs/testing';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { AnimalEntity } from './entities/animals.entity';
import {
	ArgumentMetadata,
	NotFoundException,
	ValidationPipe,
} from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { globalValidationPipeOptions } from '../main.validationpipe';

describe('AnimalController', () => {
	let controller: AnimalController;
	let service: AnimalService;
	let testingModule: TestingModule;
	const testAnimals = ['Pikkewyn', 'Renoster', 'Kameelperd'];

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({ isGlobal: true }),
				TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
				TypeOrmModule.forFeature([AnimalEntity]),
			],
			controllers: [AnimalController],
			providers: [AnimalService],
		}).compile();

		// get an instance of the service and or controller you want to test
		controller = testingModule.get<AnimalController>(AnimalController);
		service = testingModule.get<AnimalService>(AnimalService);

		// seed db with animals for each testcase
		await controller.createBulk(
			testAnimals.map((str) => {
				return <CreateAnimalDto>{ name: str };
			}),
		);
	});

	// delete all data in db for each test
	afterAll(async () => {
		const repoOfAnimals: AnimalEntity[] = await controller.findAll();
		if (repoOfAnimals.length > 0) {
			const array = repoOfAnimals.map((a) => a.id);
			await service.remove(array);
		}
	});

	it('check that pagination returns 15 animals', async () => {
		expect(service.pagination()).toEqual('15 animals');
	});

	it('Get all seed animals (findAll)', async () => {
		const allAnimals: AnimalEntity[] = await controller.findAll();
		expect(allAnimals).toHaveLength(3);
		for (let index = 0; index < testAnimals.length; index++) {
			expect(allAnimals).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: testAnimals[index],
						id: expect.any(Number),
					}),
				]),
			);
		}
	});

	it('should get a specific animal (findOne)', async () => {
		const animalToGet: number = 1;
		const animal: AnimalEntity = await controller.findOne(animalToGet);
		expect(animal.id).toBe(animalToGet);
	});

	it('should throw a NotFoundError when animal doesnt exist', async () => {
		const animalToGet: number = 10000;
		await expect(controller.findOne(animalToGet)).rejects.toThrow(
			NotFoundException,
		);
	});

	it('Post new Animal (create)', async () => {
		const newAnimal: CreateAnimalDto = { name: 'Sonbeesie' };
		const insertResult: ObjectLiteral = await controller.create(newAnimal);

		expect(insertResult[0].id).toBeGreaterThan(0);
		const getById: AnimalEntity = await controller.findOne(insertResult[0].id);

		expect(getById.name).toBe(newAnimal.name);
		expect(typeof getById.id).toBe('number');
	});

	it('Update item (Update)', async () => {
		const updatedAnimalName: string = 'Seekat';
		const idOfAnimalToUpdate: number = 1;

		await controller.update(idOfAnimalToUpdate, { name: updatedAnimalName });
		expect((await controller.findOne(idOfAnimalToUpdate)).name).toBe(
			updatedAnimalName,
		);
	});

	it('Should throw a not found exception if you update a non-existent item', async () => {
		await expect(controller.update(2342, { name: 'fso' })).rejects.toThrow(
			NotFoundException,
		);
	});

	it('Delete items from db (remove)', async () => {
		let repoOfAnimals: AnimalEntity[] = await controller.findAll();

		for (let i = 0; i < repoOfAnimals.length; i++) {
			await controller.remove(repoOfAnimals[i].id);
		}
		let shouldBeEmptyArray: AnimalEntity[] = await controller.findAll();
		expect(shouldBeEmptyArray).toHaveLength(0);
	});

	describe('CreateAnimalDto', () => {
		it('should strip invalid values', async () => {
			// setup the validation pipe to only strip values
			const validator = new ValidationPipe({
				whitelist: true,
				transform: true,
			});
			const testObject = {
				name: 'name',
				foo: 'br',
			};
			const meta: ArgumentMetadata = {
				type: 'body',
				metatype: CreateAnimalDto,
				data: 'name',
			};
			const strippedObject = await validator.transform(testObject, meta);

			expect(strippedObject).toEqual(
				expect.objectContaining({
					name: 'name',
				}),
			);
			expect(strippedObject).toEqual(
				expect.not.objectContaining({ foo: expect.any(String) }),
			);
		});

		it('should throw an error on missing required property', async () => {
			const validator = new ValidationPipe(globalValidationPipeOptions());
			const testObject = {};
			const meta: ArgumentMetadata = {
				type: 'body',
				metatype: CreateAnimalDto,
			};
			try {
				const result = await validator.transform(testObject, meta);
			} catch (e) {
				expect(e.response).toEqual(
					expect.objectContaining({
						statusCode: 400,
						message: expect.arrayContaining([
							expect.stringContaining('name should not be empty'),
						]),
						error: 'Bad Request',
					}),
				);
			}
		});
	});
});
