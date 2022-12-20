import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService {
	protected constructor(protected readonly repository: Repository<any>) {}

	async all(): Promise<any[]> {
		return this.repository.find();
	}

	async create(data): Promise<any> {
		return this.repository.save(data);
	}

	async findOne(condition): Promise<any> {
		return this.repository.findOne(condition);
	}
}
