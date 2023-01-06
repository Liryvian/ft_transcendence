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
		await this.findOne({ where: { id } });
		return this.repository.update(id, data);
	}

	async remove(id: number | number[]): Promise<DeleteResult> {
		return this.repository.delete(id);
	}
}
