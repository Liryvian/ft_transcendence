import { Test, TestingModule } from '@nestjs/testing';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm/typeorm.service';
import { Animal } from './entities/animals.entity';

describe('AnimalController', () => {
  let controller: AnimalController;
  let service: AnimalService;
  let testingModule: TestingModule;

  const testAnimals = ["Pikkewyn", "Renoster" ,"Kameelperd"];

  beforeEach(async () => {
      testingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
        TypeOrmModule.forFeature([Animal])
      ],
      controllers: [AnimalController],
      providers: [AnimalService],
    }).compile();

    // get an instance of the service and or controller you want to test
    controller = testingModule.get<AnimalController>(AnimalController);
    service = testingModule.get<AnimalService>(AnimalService);

    // seed db with animals for each testcase
    for (const animal in testAnimals) {
      await controller.create({name: testAnimals[animal]})
    }
  })

  // delete all data in db for each test
  afterEach(async () => {
    let repoOfAnimals = await controller.findAll();
    
    for (let i = 0; i < repoOfAnimals.length; i++) {await controller.remove(i + 1);}
  })

  it('check that pagination returns 15 animals', async () => {
      expect(service.pagination()).toEqual("15 animals");
  })
  
  it('Get all seed animals (findAll)', async () => {
    const allAnimals = await controller.findAll();
    expect(allAnimals).toHaveLength(3);
    for (let index = 0; index < allAnimals.length; index++) {
      expect(allAnimals[index].id).toBe(index + 1) // starts indexing in table from 1 not 0
      expect(allAnimals[index].name).toBe(testAnimals[index])
    }
  });

  it('Get a specific animal (getOne)', async () => {
    const animalToGet: number = 1;
    const animal = await controller.getOne(animalToGet);
    expect(animal.id).toBe(1);
  });
  
  it('Post new Animals (create)',async () => {
    const newAnimal = "Sonbeesie";
    const newAnimalId = 4;
    const createdAnimal = await controller.create({name: newAnimal});
    expect(createdAnimal.name).toBe(newAnimal);
    expect(createdAnimal.id).toBe(newAnimalId);
  })
  
  it("Update item (Update)",async () => {
      const updatedAnimalName: string = "Seekat";
      const idOfAnimalToUpdate: number = 1;

      await controller.update(idOfAnimalToUpdate, {name: updatedAnimalName});
      expect((await controller.getOne(idOfAnimalToUpdate)).name).toBe(updatedAnimalName);
  })

  it("Delete items from db (remove)",async () => {
    let repoOfAnimals = await controller.findAll();
    
    for (let i = 0; i < repoOfAnimals.length; i++) {await controller.remove(i + 1);}
    let shouldBeEmptyArray = await controller.findAll();
    expect(shouldBeEmptyArray).toHaveLength(0);
  })

});
