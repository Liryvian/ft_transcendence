import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './typeorm.service';

describe('TypeOrmConfigService', () => {
	let service: TypeOrmConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TypeOrmConfigService, ConfigService],
		}).compile();

		service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should have a createTypeOrmOptions method', () => {
		expect(service.createTypeOrmOptions()).toBeDefined();
	});

	it('should be have required keys and values', () => {
		const optionsContent = service.createTypeOrmOptions();
		const desiredObject = {
			type: 'postgres',
		};
		expect(optionsContent).toMatchObject(desiredObject);
	});
});
