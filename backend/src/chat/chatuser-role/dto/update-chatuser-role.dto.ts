import { PartialType } from '@nestjs/mapped-types';
import { CreateChatuserRoleDto } from './create-chatuser-role.dto';

export class UpdateChatuserRoleDto extends PartialType(CreateChatuserRoleDto) {}
