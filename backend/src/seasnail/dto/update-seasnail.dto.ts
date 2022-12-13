import { PartialType } from '@nestjs/mapped-types';
import { CreateSeasnailDto } from './create-seasnail.dto';

export class UpdateSeasnailDto extends PartialType(CreateSeasnailDto) {}
