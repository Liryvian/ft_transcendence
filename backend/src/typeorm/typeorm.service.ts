import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	@Inject(ConfigService)
  	private readonly config: ConfigService;

	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: this.config.get<string>('DB_CONNECTION_TYPE'),
			host: this.config.get<string>('POSTGRES_SERVER'),
			port: this.config.get<number>('POSTGRES_PORT'),
			database: this.config.get<string>('POSTGRES_DB'),
			username: this.config.get<string>('POSTGRES_USERNAME'),
			password: this.config.get<string>('POSTGRES_PASSWORD'),
			autoLoadEntities: true, // do not have this turned on for production!
			// entities: ['dist/**/*.entity.{ts,js}'],
			// migrations: ['dist/migrations/*.{ts,js}'],
			// migrationsTableName: 'typeorm_migrations',
			logger: 'file',
			synchronize: true, // never use TRUE in production!
		};
	}
}
