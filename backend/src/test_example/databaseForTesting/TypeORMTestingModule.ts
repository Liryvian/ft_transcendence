import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { Animal } from '../entities/animals.entity';

import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

// export const TypeORmTestingModule = () => [
//   TypeOrmModule.forRoot({
//     type: 'better-sqlite3',
//     database: ':memory:',
//     dropSchema: true,
//     entities: [Animal],
//     synchronize: true,
//   }),
//   TypeOrmModule.forFeature([Animal]),
// ];

@Injectable()
export class TypeORmTestingModule implements TypeOrmOptionsFactory {
	@Inject(ConfigService)
	private readonly config: ConfigService;

	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
      name: this.config.get("DATABASE_NAME_FOR_TEST"),
      type: 'better-sqlite3',
			database: ':memory:',
			autoLoadEntities: true, // do not have this turned on for production!
			// entities: ['dist/**/*.entity.{ts,js}'],
			// migrations: ['dist/migrations/*.{ts,js}'],
			// migrationsTableName: 'typeorm_migrations',
			// logger: 'file',
			synchronize: true, // never use TRUE in production!
		};
	}
}
