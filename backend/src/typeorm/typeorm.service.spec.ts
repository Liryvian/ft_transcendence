import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmConfigService } from './typeorm.service';
import { ConfigService } from '@nestjs/config';


describe('TypeOrmConfigService', () => {
	let service: TypeOrmConfigService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ConfigService, TypeOrmConfigService],
		}).compile();

		service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

    it('should be have a password', () => {
		const desiredObject = {
			database: expect.any(String),
			username: expect.any(String),
			password: expect.any(String),
			host: expect.any(String),
			port: expect.any(Number),
			type: 'postgres',
		};
		expect(service.createTypeOrmOptions()).toMatchObject(desiredObject);
	});
});
