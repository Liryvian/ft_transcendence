import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

<<<<<<< HEAD
  @Get('')
=======
  @Get()
>>>>>>> 12a6c0c1362c965c14a4d050c3f9689f370b34f4
  getHello(): string {
    return this.appService.getHello();
  }
}
