import { Test, TestingModule } from '@nestjs/testing';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { AnimalEntity } from './entities/animals.entity';
import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { CreateAnimalDto } from './dto/create-animal.dto';

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
		for (const animal in testAnimals) {
			await controller.create({ name: testAnimals[animal] });
		}
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
		const newAnimal = 'Sonbeesie';
		const insertResult: ObjectLiteral = await controller.create({
			name: newAnimal,
		});

		expect(insertResult[0].id).toBeGreaterThan(0);
		const getById: AnimalEntity = await controller.findOne(insertResult[0].id);

		expect(getById.name).toBe(newAnimal);
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
		const parent: ObjectLiteral = await controller.create({ name: 'Wildsbok' });
		const child: ObjectLiteral = await controller.create({
			name: 'Klipspringer',
			parent: parent[0].id,
		});

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
		expect((result = await controller.create(arrayOfAnimals))).toEqual(
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
});
