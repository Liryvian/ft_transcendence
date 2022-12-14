import { Module } from '@nestjs/common';
import {SeasnailModule} from "../seasnail/seasnail.module";
import {AuthController} from "./auth.controller";

@Module({
    imports: [
        SeasnailModule
    ],
    controllers: [AuthController],
})

export class AuthModule{}
