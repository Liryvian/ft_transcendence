import { Module } from '@nestjs/common';
import { TestExampleService } from './test_example.service';
import { TestExampleController } from './test_example.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestExample } from './entities/test_example.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestExample])],
  controllers: [TestExampleController],
  providers: [TestExampleService]
})
export class TestExampleModule {}
