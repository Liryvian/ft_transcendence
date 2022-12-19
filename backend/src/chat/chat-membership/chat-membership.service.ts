import { Injectable } from '@nestjs/common';
import { CreateChatMembershipDto } from './dto/create-chat-membership.dto';
import { UpdateChatMembershipDto } from './dto/update-chat-membership.dto';

@Injectable()
export class ChatMembershipService {
  create(createChatMembershipDto: CreateChatMembershipDto) {
    return 'This action adds a new chatMembership';
  }

  findAll() {
    return `This action returns all chatMembership`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatMembership`;
  }

  update(id: number, updateChatMembershipDto: UpdateChatMembershipDto) {
    return `This action updates a #${id} chatMembership`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatMembership`;
  }
}
