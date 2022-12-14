import { Module } from '@nestjs/common';
import { SeasnailService } from './seasnail.service';
import { SeasnailController } from './seasnail.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seasnail } from "./entities/seasnail.entity";

@Module({
    imports:[
      TypeOrmModule.forFeature([Seasnail]),
    ],
    controllers: [SeasnailController],
    providers: [SeasnailService],
    exports: [SeasnailService],
})

export class SeasnailModule {}
