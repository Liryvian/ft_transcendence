import { Test, TestingModule } from '@nestjs/testing';
import { SeasnailController } from './seasnail.controller';
import { SeasnailService } from './seasnail.service';

describe('SeasnailController', () => {
  let controller: SeasnailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeasnailController],
      providers: [SeasnailService],
    }).compile();

    controller = module.get<SeasnailController>(SeasnailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
