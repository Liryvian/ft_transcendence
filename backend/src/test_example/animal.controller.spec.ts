import { Test, TestingModule } from '@nestjs/testing';
import { TypeORmTestingModule } from './databaseForTesting/TypeORMTestingModule';
import { AnimalController } from './animal.controller';
import { AnimalService } from './animal.service';

describe('AnimalController', () => {
  let controller: AnimalController;
  let testingModule: TestingModule;

  beforeEach(async () => {
      testingModule = await Test.createTestingModule({
      imports: [...TypeORmTestingModule()],
      controllers: [AnimalController],
      providers: [AnimalService],
    }).compile();

    controller = testingModule.get<AnimalController>(AnimalController);
  });

  it('Post 3 Animals',async () => {
    const animals = ["Pikkewyn", "Renoster" ,"Kameelperd"];
    let i: number = 1;
    for (const animal in animals)
    {
      const newUser = await controller.create({name: animal});
      expect(newUser.name).toBe(animal);
      expect(newUser.id).toBe(i);
      ++i;
    }
  })

  it('Count empty db', async () => {
    const list = await controller.findAll();
    expect(list).toHaveLength(0);
  });


  it('FindAll db with three things', async () => {
    const animals = ["Pikkewyn", "Renoster" ,"Kameelperd"];
    for (const animal in animals){ await controller.create({name: animal}); }
      
    const list = await controller.findAll();
    expect(list).toHaveLength(3);
  });
  
  
  it("Update item",async () => {
      const originalAnimal: string = "Sonbeesie";
      const updatedAnimal: string = "Seekat";

      await controller.create({name: originalAnimal});
      expect((await controller.getOne(1)).name).toBe(originalAnimal);
      
      await controller.update(1, {name: updatedAnimal});
      expect((await controller.getOne(1)).name).toBe(updatedAnimal);
  })

  it("Delete items from db",async () => {
    const animals: string[] = ["Pikkewyn", "Renoster" ,"Kameelperd"];
    for (const animal in animals){ await controller.create({name: animal});}
    let repoOfAnimals = await controller.findAll();
    expect(repoOfAnimals).toHaveLength(3);
    
    for (let i = 0; i < animals.length; i++) {await controller.remove(i + 1);}
    let shouldBeEmptyArray = await controller.findAll();
    expect(shouldBeEmptyArray).toHaveLength(0);
  })

});
