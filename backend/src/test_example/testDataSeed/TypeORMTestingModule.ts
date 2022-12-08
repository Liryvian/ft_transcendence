import { TypeOrmModule } from '@nestjs/typeorm';
import { TestExample } from '../entities/test_example.entity';

export const TypeORmTestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [TestExample],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([TestExample]),
];