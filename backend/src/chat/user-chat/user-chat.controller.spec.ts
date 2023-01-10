import { Test, TestingModule } from '@nestjs/testing';
import { UserChatController } from './user-chat.controller';
import { UserChatService } from './user-chat.service';

describe('UserChatController', () => {
  let controller: UserChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserChatController],
      providers: [UserChatService],
    }).compile();

    controller = module.get<UserChatController>(UserChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
