import { Test, TestingModule } from '@nestjs/testing';
import { MembershipStateController } from './membership-state.controller';
import { MembershipStateService } from './membership-state.service';

describe('MembershipStateController', () => {
  let controller: MembershipStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipStateController],
      providers: [MembershipStateService],
    }).compile();

    controller = module.get<MembershipStateController>(MembershipStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
