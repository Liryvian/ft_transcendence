import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestExampleModule } from './test_example/test_example.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [
    TestExampleModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'admin_m2fVLBU',
      password: 'zj3Bbgy6njq2FfQc',
      database: 'transcendence',
      autoLoadEntities: true,
      synchronize: true,
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
