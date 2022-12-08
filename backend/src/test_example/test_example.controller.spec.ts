import { Test, TestingModule } from '@nestjs/testing';
import { TypeORmTestingModule } from './testDataSeed/TypeORMTestingModule';
import { TestExampleController } from './test_example.controller';
import { TestExampleService } from './test_example.service';

describe('TestExampleController', () => {
  let controller: TestExampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORmTestingModule()],
      controllers: [TestExampleController],
      providers: [TestExampleService],
    }).compile();

    controller = module.get<TestExampleController>(TestExampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  it('listAllUnits', async () => {
    const list = await controller.findAll();
    expect(list).toHaveLength(0);
  });

  it('addUnit',async () => {
    const data = [{"name": "JohnDoe"}, {"name": "janeDone"}, {"name": "Hermoenienaainie"}];
    let i: number = 1;
    for (const d in data)
    {
      const newUser = await controller.create({name: d});
      expect(newUser.name).toBe(d);
      expect(newUser.id).toBe(i);
      ++i;
    }
  })
});
