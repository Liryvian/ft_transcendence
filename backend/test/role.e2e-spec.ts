import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RoleController } from '../src/chats/role/role.controller';
import { CreateRoleDto } from '../src/chats/role/dto/create-role.dto';
import { Role } from '../src/chats/role/entities/role.entity';
import { globalValidationPipeOptions } from '../src/main.validationpipe';
import { AllTestingModule } from '../src/shared/test.module';

describe('role e2e', () => {
	let app: INestApplication;
	let roleController: RoleController;
	const testRoles: CreateRoleDto[] = [{ name: 'master' }, { name: 'philly' }];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions()));
		await app.init();

		roleController = moduleFixture.get<RoleController>(RoleController);

		// seed db with animals for each testcase
		for (const role in testRoles) {
			await roleController.create(testRoles[role]);
		}
	});

	afterAll(async () => {
		const roles: Role[] = await roleController.findAll();

		for (let index = 0; index < roles.length; index++) {
			await roleController.remove(roles[index].id);
		}
		await app.close();
	});

	describe('/roles (GET)', () => {
		it('should return OK', () => {
			return request(app.getHttpServer()).get('/roles').expect(HttpStatus.OK);
		});
	});
});
