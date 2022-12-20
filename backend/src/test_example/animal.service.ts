import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '../shared/abstrct.service';
import { Repository } from 'typeorm';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animals.entity';

@Injectable()
export class AnimalService extends AbstractService {
  constructor(
    @InjectRepository(Animal) private readonly animalRepo: Repository<Animal>
  ) {
      super(animalRepo);
  }

  pagination(): String
  {
    return "15 animals";
  }

}
