import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmTestConfigService implements TypeOrmOptionsFactory {
	@Inject(ConfigService)
	private readonly config: ConfigService;

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
