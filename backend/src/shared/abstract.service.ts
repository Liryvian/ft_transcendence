import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export abstract class AbstractService<T> {
	protected constructor(protected readonly repository: Repository<T>) {}

	async findAll(): Promise<T[]> {
		return this.repository.findAll();
	}

	async create(data): Promise<T> {
		return this.repository.save(data);
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
