import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmTestConfigService implements TypeOrmOptionsFactory {
	public createTypeOrmOptions(): TypeOrmModuleOptions {
		const testingConfig: TypeOrmModuleOptions = {
			type: 'better-sqlite3',
			database: ':memory:',
			autoLoadEntities: true,
			dropSchema: true,
			synchronize: true,
		};

		return testingConfig;
	}
}
