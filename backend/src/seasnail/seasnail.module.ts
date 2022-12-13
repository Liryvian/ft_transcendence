import { Module } from '@nestjs/common';
import { SeasnailService } from './seasnail.service';
import { SeasnailController } from './seasnail.controller';

@Module({
  controllers: [SeasnailController],
  providers: [SeasnailService]
})
export class SeasnailModule {}
