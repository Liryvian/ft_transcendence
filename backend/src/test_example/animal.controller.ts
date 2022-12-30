import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { AnimalEntity } from './entities/animals.entity';

@Controller('test')
export class AnimalController {
	constructor(private readonly animalService: AnimalService) {}

	//  example of catching the typeorm error and returning a custom response
	@Post()
	async create(@Body() createAnimalDto: CreateAnimalDto) {
		try {
			const createdAnimal: AnimalEntity = await this.animalService.create(
				createAnimalDto,
			);
			return createdAnimal;
		} catch (e) {
			throw new HttpException('Animal Already Exists', HttpStatus.CONFLICT);
		}
	}

	@Get()
	async findAll() {
		return this.animalService.all();
	}

	@Get(':id')
	async getOne(@Param('id') id: number) {
		return this.animalService.findOne({ where: { id } });
	}

	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateAnimalDto: UpdateAnimalDto,
	): Promise<UpdateResult> {
		return this.animalService.update(id, updateAnimalDto);
	}

	@Delete(':id')
	async remove(@Param('id') id: number): Promise<DeleteResult> {
		return this.animalService.delete(id);
	}
}
