import { Injectable, NotFoundException } from '@nestjs/common';
import {
	DeepPartial,
	DeleteResult,
	FindManyOptions,
	FindOneOptions,
	InsertResult,
	Repository,
	UpdateResult,
} from 'typeorm';

@Injectable()
export abstract class AbstractService<T> {
	protected constructor(protected readonly repository: Repository<T>) {}

	async findAll(condition?: FindManyOptions<T>): Promise<T[]> {
		return this.repository.find(condition);
	}

	/*
		the insert method allows you to insert either:
		- a single entity
		- an array of entitites

		DOES NOT HANDLE RELATIONSHIPS, USE SAVE METHOD INSTEAD!
	*/
	async insert(data): Promise<InsertResult> {
		return this.repository.insert(data);
	}

	/*
		Creates a new entity of the given type, does not store it in the DB
	*/
	create(data?: DeepPartial<T>): T;
	create(data?: DeepPartial<T>[]): T[];
	create(data?): T[] | T {
		return this.repository.create(data);
	}

	/*
		Use this if you want to create entities WITH relationships
	*/
	async save(data: DeepPartial<T>): Promise<T>;
	async save(data: DeepPartial<T>[]): Promise<T[]>;
	async save(data): Promise<T>;
	async save(data): Promise<T[]>;
	async save(data): Promise<T | T[]> {
		return this.repository.save(data);
	}

	async findOne(condition: FindOneOptions<T>): Promise<T> {
		try {
			const foundRepoItem = await this.repository.findOneOrFail(condition);
			return foundRepoItem;
		} catch (e) {
			throw new NotFoundException();
		}
	}

	async update(id: number, data): Promise<UpdateResult> {
		const updateResult: UpdateResult = await this.repository.update(id, data);
		if (updateResult.affected === 0) {
			throw new NotFoundException();
		}
		return updateResult;
	}

	async remove(id: number | number[]): Promise<DeleteResult> {
		// you can give an empty object/array, or NULL to this function
		// which will cause TypeORM to throw an error
		// in TS/JS NULL is an object, so we can check for it quite easily
		if (typeof id === 'object') {
			if (id === null || (id.hasOwnProperty('length') && id.length === 0)) {
				const res: DeleteResult = new DeleteResult();
				res.raw = [];
				res.affected = 0;
				return res;
			}
		}
		return this.repository.delete(id);
	}

	async trySeed(data: any): Promise<T>;
	async trySeed(data: any): Promise<T[]>;
	async trySeed(data: any): Promise<T | T[]> {
		try {
			const seedResult: any = await this.save(data);
			return seedResult;
		} catch (e) {
			console.error('Already seeded');
		}
	}
}
