import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestExampleService } from './test_example.service';
import { CreateTestExampleDto } from './dto/create-test_example.dto';
import { UpdateTestExampleDto } from './dto/update-test_example.dto';
import {Repository} from "typeorm";
import { TestExample } from './entities/test_example.entity';

@Controller('test')
export class TestExampleController {
  constructor(private readonly testExampleService: TestExampleService) {}

  @Post()
  async create(@Body() createTestExampleDto: CreateTestExampleDto) {
    return this.testExampleService.create(createTestExampleDto);
  }

  @Get()
  async findAll() {
    return this.testExampleService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<TestExample> 
  {
    return this.testExampleService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTestExampleDto: UpdateTestExampleDto) {
    return this.testExampleService.update(+id, updateTestExampleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.testExampleService.remove(id);
  }
}
