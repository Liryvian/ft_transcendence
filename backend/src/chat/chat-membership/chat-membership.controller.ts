import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatMembershipService } from './chat-membership.service';
import { ChatMembership} from "./entities/chat-membership.entity";

@Controller('chat-membership')
export class ChatMembershipController {
  constructor(private readonly chatMembershipService: ChatMembershipService) {
  }
  @Get()
  async all(): Promise<ChatMembership[]> {
    return await this.chatMembershipService.all();
  }
}


// import { CreateChatMembershipDto } from './dto/create-chat-membership.dto';
// import { UpdateChatMembershipDto } from './dto/update-chat-membership.dto';

// @Controller('chat-membership')
// export class ChatMembershipController {
//   constructor(private readonly chatMembershipService: ChatMembershipService) {}
//
//   @Post()
//   create(@Body() createChatMembershipDto: CreateChatMembershipDto) {
//     return this.chatMembershipService.create(createChatMembershipDto);
//   }
//
//   @Get()
//   findAll() {
//     return this.chatMembershipService.findAll();
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.chatMembershipService.findOne(+id);
//   }
//
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateChatMembershipDto: UpdateChatMembershipDto) {
//     return this.chatMembershipService.update(+id, updateChatMembershipDto);
//   }
//
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.chatMembershipService.remove(+id);
//   }
// }
