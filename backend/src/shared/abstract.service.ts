import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export abstract class AbstractService<T> {
	protected constructor(protected readonly repository: Repository<T>) {}

	async all(): Promise<T[]> {
		return this.repository.find();
	}

	async create(data): Promise<InsertResult> {
		return this.repository.insert(data);
	}

	async findOne(condition): Promise<T> {
		const foundRepoItem = await this.repository.findOne(condition);
		if (!foundRepoItem) {
			throw new NotFoundException();
		}
		return foundRepoItem;
	}

	async update(id: number, data): Promise<UpdateResult> {
		const itemToUpdate = await this.findOne({ where: { id } });
		if (!itemToUpdate) {
			throw new NotFoundException();
		}
		return this.repository.update(id, data);
	}

	async delete(id: number): Promise<DeleteResult> {
		return this.repository.delete(id);
	}
}
