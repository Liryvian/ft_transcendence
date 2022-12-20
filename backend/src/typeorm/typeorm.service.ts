import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Animal } from '../test_example/entities/animals.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
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

		const productionConfig: TypeOrmModuleOptions = {
			type: 'postgres',
			host: this.config.get<string>('POSTGRES_SERVER'),
			port: parseInt(this.config.get<string>('POSTGRES_PORT')),
			database: this.config.get<string>('POSTGRES_DB'),
			username: this.config.get<string>('POSTGRES_USER'),
			password: this.config.get<string>('POSTGRES_PASSWORD'),
			autoLoadEntities: true, // do not have this turned on for production!
			// entities: ['dist/**/*.entity.{ts,js}'],
			// migrations: ['dist/migrations/*.{ts,js}'],
			// migrationsTableName: 'typeorm_migrations',
			logger: 'file',
			synchronize: true, // never use TRUE in production!
		};

		if (this.config.get<string>('USE_TEST_DB') == "1")
		{
			return testingConfig;
		}

		return productionConfig;
	}
}
