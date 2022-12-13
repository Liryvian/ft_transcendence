import { Injectable } from '@nestjs/common';
import { CreateSeasnailDto } from './dto/create-seasnail.dto';
import { UpdateSeasnailDto } from './dto/update-seasnail.dto';

@Injectable()
export class SeasnailService {
  create(createSeasnailDto: CreateSeasnailDto) {
    return 'This action adds a new seasnail';
  }

  findAll() {
    return `This action returns all seasnail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seasnail`;
  }

  update(id: number, updateSeasnailDto: UpdateSeasnailDto) {
    return `This action updates a #${id} seasnail`;
  }

  remove(id: number) {
    return `This action removes a #${id} seasnail`;
  }
}
