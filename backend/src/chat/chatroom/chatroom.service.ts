import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Chatroom} from "./entities/chatroom.entity";
import {Repository} from "typeorm";

@Injectable()
export class ChatroomService {
  constructor(
      @InjectRepository(Chatroom) private readonly chatroomRepository: Repository<Chatroom>
  ) {
  }
}



// import { Injectable } from '@nestjs/common';
// import { CreateChatroomDto } from './dto/create-chatroom.dto';
// import { UpdateChatroomDto } from './dto/update-chatroom.dto';
//
// @Injectable()
// export class ChatroomService {
//   create(createChatroomDto: CreateChatroomDto) {
//     return 'This action adds a new chatroom';
//   }
//
//   findAll() {
//     return `This action returns all chatroom`;
//   }
//
//   findOne(id: number) {
//     return `This action returns a #${id} chatroom`;
//   }
//
//   update(id: number, updateChatroomDto: UpdateChatroomDto) {
//     return `This action updates a #${id} chatroom`;
//   }
//
//   remove(id: number) {
//     return `This action removes a #${id} chatroom`;
//   }
// }
