import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeasnailService } from './seasnail.service';
import { CreateSeasnailDto } from './dto/create-seasnail.dto';
import { UpdateSeasnailDto } from './dto/update-seasnail.dto';

@Controller('seasnail')
export class SeasnailController {
  constructor(private readonly seasnailService: SeasnailService) {}

  @Post()
  create(@Body() createSeasnailDto: CreateSeasnailDto) {
    return this.seasnailService.create(createSeasnailDto);
  }

  @Get()
  findAll() {
    return this.seasnailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seasnailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeasnailDto: UpdateSeasnailDto) {
    return this.seasnailService.update(+id, updateSeasnailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seasnailService.remove(+id);
  }
}
