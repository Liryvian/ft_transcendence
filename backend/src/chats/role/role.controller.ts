import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Post()
	create(@Body() createRoleDto: CreateRoleDto) {
		return this.roleService.insert(createRoleDto);
	}

	@Get()
	findAll() {
		return this.roleService.findAll({ relations: { userChats: true } });
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.roleService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
		return this.roleService.update(id, updateRoleDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.roleService.remove(id);
	}
}
