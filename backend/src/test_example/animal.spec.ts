import { Test, TestingModule } from '@nestjs/testing';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { AnimalEntity } from './entities/animals.entity';
import { NotFoundException } from '@nestjs/common';

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

		// seed db with animals for entire describe block
		for (const animal in testAnimals) {
			await controller.create({ name: testAnimals[animal] });
		}
	});

	// delete all data in db for entire describe block
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

	it('should get a specific animal (getOne)', async () => {
		const animalToGet: number = 1;
		const animal: AnimalEntity = await controller.getOne(animalToGet);
		expect(animal.id).toBe(animalToGet);
	});

	it('should throw a NotFoundError when animal doesnt exist', async () => {
		const animalToGet: number = 10000;
		await expect(controller.getOne(animalToGet)).rejects.toThrow(
			NotFoundException,
		);
	});

	it('Post new Animal (create)', async () => {
		const newAnimal = 'Sonbeesie';
		const createdAnimal: AnimalEntity = await controller.create({
			name: newAnimal,
		});
		expect(createdAnimal.name).toBe(newAnimal);
		expect(typeof createdAnimal.id).toBe('number');
	});

	it('Update item (Update)', async () => {
		const updatedAnimalName: string = 'Seekat';
		const idOfAnimalToUpdate: number = 1;

		await controller.update(idOfAnimalToUpdate, { name: updatedAnimalName });
		expect((await controller.getOne(idOfAnimalToUpdate)).name).toBe(
			updatedAnimalName,
		);
	});

	it('Delete items from db (remove)', async () => {
		let repoOfAnimals: AnimalEntity[] = await controller.findAll();

		for (let i = 0; i < repoOfAnimals.length; i++) {
			await controller.remove(i + 1);
		}
		let shouldBeEmptyArray: AnimalEntity[] = await controller.findAll();
		expect(shouldBeEmptyArray).toHaveLength(0);
	});
});
