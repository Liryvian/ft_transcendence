import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UserchatRoleService } from './userchat-role.service';
import { CreateUserchatRoleDto } from './dto/create-userchat-role.dto';
import { UpdateUserchatRoleDto } from './dto/update-userchat-role.dto';

@Controller('userchat-role')
export class UserchatRoleController {
	constructor(private readonly userchatRoleService: UserchatRoleService) {}

	@Post()
	create(@Body() createUserchatRoleDto: CreateUserchatRoleDto) {
		return this.userchatRoleService.create(createUserchatRoleDto);
	}

	@Get()
	findAll() {
		return this.userchatRoleService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.userchatRoleService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateUserchatRoleDto: UpdateUserchatRoleDto,
	) {
		return this.userchatRoleService.update(+id, updateUserchatRoleDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.userchatRoleService.remove(+id);
	}
}
