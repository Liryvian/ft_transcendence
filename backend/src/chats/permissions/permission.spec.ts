import { Test, TestingModule } from '@nestjs/testing';
import { AllTestingModule } from '../../shared/test.module';
import { PermissionService } from './permission.service';

describe('Permissions', () => {
	let service: PermissionService;
	let testingModule: TestingModule;

	beforeAll(async () => {
		testingModule = await Test.createTestingModule({
			imports: [AllTestingModule],
		}).compile();

		service = testingModule.get<PermissionService>(PermissionService);
	});

	it('service should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should have unique constraint on permission name', async () => {
		expect(service.save([{ name: 'name' }, { name: 'name' }])).rejects.toThrow(
			'UNIQUE constraint failed',
		);
	});

	it('should have not null constrain on permission name', async () => {
		expect(service.save({})).rejects.toThrow('NOT NULL');
	});
});
