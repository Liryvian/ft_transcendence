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
import { validate } from 'class-validator';
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
				return { name: str };
			}),
		);
	});

	// delete all data in db for each test
	afterAll(async () => {
		const repoOfAnimals: AnimalEntity[] = await controller.findAll();
		for (let i = 0; i < repoOfAnimals.length; i++) {
			await controller.remove(i + 1);
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

	it('Delete items from db (remove)', async () => {
		let repoOfAnimals: AnimalEntity[] = await controller.findAll();

		for (let i = 0; i < repoOfAnimals.length; i++) {
			await controller.remove(repoOfAnimals[i].id);
		}
		let shouldBeEmptyArray: AnimalEntity[] = await controller.findAll();
		expect(shouldBeEmptyArray).toHaveLength(0);
	});

	it('should show relationships with the findAll method', async () => {
		const wildsBok: CreateAnimalDto = { name: 'Wildsbok' };
		const parent: ObjectLiteral = await controller.create(wildsBok);
		const klipSpringer: CreateAnimalDto = {
			name: 'Klipspringer',
			parent: parent[0].id,
		};
		const child: ObjectLiteral = await controller.create(klipSpringer);

		const allAnimalsWithRelations: AnimalEntity[] = await controller.findAll();
		expect(allAnimalsWithRelations).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					parent: expect.objectContaining({
						id: parent[0].id,
					}),
				}),
			]),
		);
		controller.remove(child[0].id);
		controller.remove(parent[0].id);
	});

	it('should create and delete with array of animals', async () => {
		const arrayOfAnimals: CreateAnimalDto[] = [
			{ name: 'Dolfyn' },
			{ name: 'Erdvark' },
			{ name: 'Luidier' },
		];
		let result: ObjectLiteral;
		expect((result = await controller.createBulk(arrayOfAnimals))).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: expect.any(Number) }),
				expect.objectContaining({ id: expect.any(Number) }),
				expect.objectContaining({ id: expect.any(Number) }),
			]),
		);
		await expect(
			controller.remove(result.map((o: ObjectLiteral) => o.id)),
		).resolves.toEqual(
			expect.objectContaining({
				affected: arrayOfAnimals.length,
			}),
		);
		await expect(controller.findOne(result[0].id)).rejects.toThrow('Not Found');
		await expect(controller.findOne(result[1].id)).rejects.toThrow('Not Found');
		await expect(controller.findOne(result[2].id)).rejects.toThrow('Not Found');
	});

	describe('CreateAnimalDto', () => {
		it('should strip invalid values', async () => {
			const validator = new ValidationPipe(globalValidationPipeOptions());
			const testObject = {
				name: '',
				foo: 'br',
			};
			const meta: ArgumentMetadata = {
				type: 'body',
				metatype: CreateAnimalDto,
				data: 'name',
			};
			console.log(validator.transform(testObject, meta));
			console.log(await validator.transform(testObject, meta));
		});
	});

	// it('should fail when trying to create with object dat does not comply to DTO validation rules', async () => {
	// 	// create object without DTO so we can skip a value
	// 	const incompleteAnimal: CreateAnimalDto = { name: null };
	// 	console.log(await controller.create(incompleteAnimal));
	// 	await expect(controller.create(incompleteAnimal)).rejects.toThrow('');
	// });
});
