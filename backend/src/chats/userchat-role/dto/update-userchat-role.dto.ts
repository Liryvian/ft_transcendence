import { PartialType } from '@nestjs/mapped-types';
import { CreateUserchatRoleDto } from './create-userchat-role.dto';

export class UpdateUserchatRoleDto extends PartialType(CreateUserchatRoleDto) {}
