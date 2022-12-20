import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animals.entity';

@Controller('test')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  async create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }

  @Get()
  async findAll() {
    return this.animalService.all();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Animal> 
  {
    return this.animalService.findOne({where: {id}});
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalService.update(id, updateAnimalDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.animalService.delete(id);
  }
}
