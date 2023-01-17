import { Injectable, NotFoundException } from '@nestjs/common';
import {
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

	async findAll(condition?: FindManyOptions): Promise<T[]> {
		return this.repository.find(condition);
	}

	/*
		the insert method allows you to insert either:
		- a single entity
		- an array of entitites
	*/
	async create(data): Promise<InsertResult> {
		return this.repository.insert(data);
	}

	async findOne(condition: FindOneOptions): Promise<T> {
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

	getRepo(): Repository<T> {
		return this.repository;
	}
}
