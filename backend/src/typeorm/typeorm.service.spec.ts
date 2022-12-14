import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

	it('should be have required keys and values', async () => {
		const optionsContent = await service.createTypeOrmOptions();
		const desiredObject = {
			database: expect.any(String),
			username: expect.any(String),
			password: expect.any(String),
			host: expect.any(String),
			port: expect.any(String),
			type: 'postgres',
		};
		expect(optionsContent).toMatchObject(desiredObject);
	});
});
