import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestExampleDto } from './dto/create-test_example.dto';
import { UpdateTestExampleDto } from './dto/update-test_example.dto';
import { TestExample } from './entities/test_example.entity';

@Injectable()
export class TestExampleService {
  constructor(
    @InjectRepository(TestExample) private readonly exampleRepo: Repository<TestExample>
  ) {}

  async create(data: CreateTestExampleDto) {
    const newUser = await this.exampleRepo.create({...data});
    return this.exampleRepo.save(newUser);
  }

  async findAll(): Promise<TestExample[]>{
    return this.exampleRepo.find();
  }

  async findOne(id: number): Promise<TestExample> {

    return this.exampleRepo.findOneBy({id});
  }

  async update(id: number, updateTestExampleDto: UpdateTestExampleDto) {
    return `This action updates a #${id} testExample`;
  }

  async remove(id: number): Promise<any> {
    return this.exampleRepo.delete(id);
  }
}
