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
	ParseArrayPipe,
} from '@nestjs/common';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Controller('test')
export class AnimalController {
	constructor(private readonly animalService: AnimalService) {}

	//  example of catching the typeorm error and returning a custom response
	@Post()
	async create(@Body() createAnimalDto: CreateAnimalDto) {
		try {
			const insertedAnimal: InsertResult = await this.animalService.insert(
				createAnimalDto,
			);
			return insertedAnimal.identifiers;
		} catch (e) {
			throw new HttpException('Animal Already Exists', HttpStatus.CONFLICT);
		}
	}

	/*
		Example implementation of posting an array of entities
		including validation of those entities
	*/
	@Post('bulk')
	async createBulk(
		@Body(
			new ParseArrayPipe({
				items: CreateAnimalDto,
				whitelist: true,
				forbidNonWhitelisted: true,
			}),
		)
		createAnimalDtos: CreateAnimalDto[],
	) {
		if (createAnimalDtos.length === 0) {
			return [];
		}
		try {
			const insertedAnimals: InsertResult = await this.animalService.insert(
				createAnimalDtos,
			);
			return insertedAnimals.identifiers;
		} catch (e) {
			throw new HttpException('Animal Already Exists', HttpStatus.CONFLICT);
		}
	}

	@Get()
	async findAll() {
		return this.animalService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number) {
		return this.animalService.findOne({ where: { id } });
	}

	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateAnimalDto: UpdateAnimalDto,
	): Promise<UpdateResult> {
		return this.animalService.update(id, updateAnimalDto);
	}

	/*
		example implementation of removing with an array of ids
	*/
	@Delete('bulk')
	async removeBulk(
		@Body(
			new ParseArrayPipe({
				items: Number,
			}),
		)
		ids: number[],
	): Promise<DeleteResult> {
		if (ids === null || (ids.hasOwnProperty('length') && ids.length === 0)) {
			return new DeleteResult();
		}
		return this.animalService.remove(ids);
	}

	@Delete(':id')
	async remove(@Param('id') id: number): Promise<DeleteResult> {
		return this.animalService.remove(id);
	}
}
