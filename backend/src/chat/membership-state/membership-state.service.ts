import { Injectable } from '@nestjs/common';
import { CreateMembershipStateDto } from './dto/create-membership-state.dto';
import { UpdateMembershipStateDto } from './dto/update-membership-state.dto';

@Injectable()
export class MembershipStateService {
  create(createMembershipStateDto: CreateMembershipStateDto) {
    return 'This action adds a new membershipState';
  }

  findAll() {
    return `This action returns all membershipState`;
  }

  findOne(id: number) {
    return `This action returns a #${id} membershipState`;
  }

  update(id: number, updateMembershipStateDto: UpdateMembershipStateDto) {
    return `This action updates a #${id} membershipState`;
  }

  remove(id: number) {
    return `This action removes a #${id} membershipState`;
  }
}
