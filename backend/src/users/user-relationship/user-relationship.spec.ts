import { Test, TestingModule } from '@nestjs/testing';
import { UserRelationshipService } from './user-relationship.service';

describe('UserRelationshipService', () => {
  let service: UserRelationshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRelationshipService],
    }).compile();

    service = module.get<UserRelationshipService>(UserRelationshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
