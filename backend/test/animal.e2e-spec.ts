import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAnimalDto } from './../src/test_example/dto/create-animal.dto';
import { AnimalController } from '../src/test_example/animal.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../src/typeorm/typeorm.service';
import { AnimalModule } from '../src/test_example/animal.module';
import { UpdateAnimalDto } from 'src/test_example/dto/update-animal.dto';

describe("AnimalController (e2e)", () => {
    let app: INestApplication;
    let animalController: AnimalController;
    const testAnimals = ["Pikkewyn", "Renoster" ,"Kameelperd"];
    
    const mockAnimal: CreateAnimalDto = {name: "Ystervarkie"};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                    ConfigModule.forRoot({ isGlobal: true }),
                    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
                    AnimalModule
            ],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

        animalController = moduleFixture.get<AnimalController>(AnimalController);
            // seed db with animals for each testcase
        for (const animal in testAnimals) {
            await animalController.create({name: testAnimals[animal]})
        }
	});

    afterAll(async () => {
        app.close();
    })
    
    describe("/test  (GET)", () => {
        it("it should retrun an array of all users", () => {
            return request(app.getHttpServer())
                .get("/test")
                .expect(HttpStatus.OK)
        })
    })

    describe("/test/3  (GET)", () => {
        it("it should retrun an array of all users", () => {
            return request(app.getHttpServer())
                .get("/test/3")
                .expect(HttpStatus.OK)
                .expect((response: request.Response) => {
                    const {
                        id,
                        name
                    } = response.body;
                    expect(typeof id).toBe("number"),
                    expect(name).toEqual(testAnimals[2]);
                })
        })
    })
    
    describe("/test  (POST)", () => {
        it("it should return a the created user data", () => {
            return request(app.getHttpServer())
                .post("/test")
                .set('Accept', 'application/json')
                .send(mockAnimal)
                .expect(HttpStatus.CREATED)
                .expect((response: request.Response) => {
                    console.log(response.body)
                    const {
                        id,
                        name
                    } = response.body;
                    expect(typeof id).toBe("number"),
                    expect(name).toEqual(mockAnimal.name);
                    console.log(name);
                })
            })
        })
        
        describe("/test/1  (delete)", () => {
            it("it should delete a user", () => {
                return request(app.getHttpServer())
                .delete("/test/1")
                .expect(HttpStatus.OK)
            })
        })
        
        describe("/test/2  (patch)", () => {
            it("update animal with id 2", () => {
                const updateData: UpdateAnimalDto = {name: "Nagapie"}
                return request(app.getHttpServer())
                    .patch("/test/2")
                    .set('Accept', 'application/json')
                    .send(updateData)
                    .expect(HttpStatus.OK)
                    .expect((response: request.Response) => {
                        const {
                            affected
                        } = response.body;
                        expect(affected).toEqual(1);
                    })
                })
            })
});
