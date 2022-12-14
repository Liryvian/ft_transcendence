import {Body, Controller, Post} from '@nestjs/common';
import {SeasnailService} from "../seasnail/seasnail.service";

@Controller()
export class AuthController {

    constructor(private seasnailService: SeasnailService){

    }
    @Post('register')
    async register(@Body() body){
        return this.seasnailService.create(body);
    }
}
