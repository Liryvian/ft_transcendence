import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ChatuserRoleService } from './chatuser-role.service';
import { CreateChatuserRoleDto } from './dto/create-chatuser-role.dto';
import { UpdateChatuserRoleDto } from './dto/update-chatuser-role.dto';

@Controller('chatuser-role')
export class ChatuserRoleController {
	constructor(private readonly chatuserRoleService: ChatuserRoleService) {}

	@Post()
	create(@Body() createChatuserRoleDto: CreateChatuserRoleDto) {
		return this.chatuserRoleService.create(createChatuserRoleDto);
	}

	@Get()
	findAll() {
		return this.chatuserRoleService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: number) {
		return this.chatuserRoleService.findOne({ where: { id } });
	}

	@Patch(':id')
	update(
		@Param('id') id: number,
		@Body() updateChatuserRoleDto: UpdateChatuserRoleDto,
	) {
		return this.chatuserRoleService.update(+id, updateChatuserRoleDto);
	}

	@Delete(':id')
	remove(@Param('id') id: number) {
		return this.chatuserRoleService.remove(+id);
	}
}
