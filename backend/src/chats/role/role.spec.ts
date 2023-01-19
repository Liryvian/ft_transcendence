import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { AllTestingModule } from '../../shared/test.module';

describe('RoleController', () => {
	let controller: RoleController;
	let service: RoleService;
	let testModule: TestingModule;

	const testRoles: CreateRoleDto[] = [{ name: 'master' }, { name: 'philly' }];

	beforeAll(async () => {
		testModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		controller = testModule.get<RoleController>(RoleController);
		service = testModule.get<RoleService>(RoleService);

		for (const roles in testRoles) {
			await controller.create(testRoles[roles]);
		}
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
	afterAll(async () => {
		const repoOfRoles: Role[] = await controller.findAll();
		for (let i = 0; i < repoOfRoles.length; i++) {
			await controller.remove(i + 1);
		}
	});

	it('Get all Roles', async () => {
		const allRoles: Role[] = await controller.findAll();
		expect(allRoles).toHaveLength(2);
		for (let index = 0; index < allRoles.length; index++) {
			expect(allRoles).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(Number),
						name: testRoles[index].name,
					}),
				]),
			);
		}
	});

	it('Get a specific role', async () => {
		const specificRole = 2;
		const role: Role = await controller.findOne(specificRole);
		expect(role.id).toBe(specificRole);
	});
});
