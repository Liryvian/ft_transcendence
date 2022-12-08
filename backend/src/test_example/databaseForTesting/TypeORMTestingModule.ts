import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from '../entities/animals.entity';

export const TypeORmTestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [Animal],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Animal]),
];