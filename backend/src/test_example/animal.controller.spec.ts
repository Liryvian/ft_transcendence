import { Test, TestingModule } from '@nestjs/testing';
import { TypeORmTestingModule } from './databaseForTesting/TypeORMTestingModule';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';

describe('AnimalController', () => {
  let controller: AnimalController;
  let service: AnimalService;
  let testingModule: TestingModule;

  const testAnimals = ["Pikkewyn", "Renoster" ,"Kameelperd"];

  beforeEach(async () => {
      testingModule = await Test.createTestingModule({
      imports: [...TypeORmTestingModule()],
      controllers: [AnimalController],
      providers: [AnimalService],
    }).compile();

    controller = testingModule.get<AnimalController>(AnimalController);
    service = testingModule.get<AnimalService>(AnimalService);

    // seed db with animals for each testcase
    for (const animal in testAnimals) {
      await controller.create({name: testAnimals[animal]})
    }
  });

  // delete all data in db for each test
  afterEach(async () => {
    let repoOfAnimals = await controller.findAll();
    
    for (let i = 0; i < repoOfAnimals.length; i++) {await controller.remove(i + 1);}
  })

  
  it('Get all seed animals', async () => {
    const list = await controller.findAll();
    expect(list).toHaveLength(3);
  });
  
  it('Post new Animals',async () => {
    const newAnimal = "Sonbeesie";
    const newAnimalId = 4;
    const createdAnimal = await controller.create({name: newAnimal});
    expect(createdAnimal.name).toBe(newAnimal);
    expect(createdAnimal.id).toBe(newAnimalId);
  })
  
  it("Update item",async () => {
      const updatedAnimal: string = "Seekat";

      await controller.update(1, {name: updatedAnimal});
      expect((await controller.getOne(1)).name).toBe(updatedAnimal);
  })

  it("Delete items from db",async () => {
    let repoOfAnimals = await controller.findAll();
    
    for (let i = 0; i < repoOfAnimals.length; i++) {await controller.remove(i + 1);}
    let shouldBeEmptyArray = await controller.findAll();
    expect(shouldBeEmptyArray).toHaveLength(0);
  })

});
