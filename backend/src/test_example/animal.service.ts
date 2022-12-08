import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animals.entity';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal) private readonly animalRepo: Repository<Animal>
  ) {}

  async create(data: CreateAnimalDto): Promise<Animal> {
    const newUser = this.animalRepo.create({...data});
    return this.animalRepo.save(newUser);
  }

  async findAll(): Promise<Animal[]>{
    return this.animalRepo.find();
  }

  async findOne(id: number): Promise<Animal> {

    return this.animalRepo.findOneBy({id});
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    return this.animalRepo.update(id, updateAnimalDto);
  }

  async remove(id: number): Promise<any> {
    return this.animalRepo.delete(id);
  }
}
