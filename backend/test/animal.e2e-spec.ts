import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAnimalDto } from './../src/test_example/dto/create-animal.dto';
import { AppModule } from '../src/app.module';
import { TypeORmTestingModule } from '../src/test_example/databaseForTesting/TypeORMTestingModule';

describe("AnimalController (e2e)", () => {
    let app: INestApplication;

    const mockAnimal: CreateAnimalDto = {name: "Ystervarkie"};

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ...TypeORmTestingModule(),
                AppModule,
            ],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
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

    describe("/test  (POST)", () => {
        it("it should return a the created user data", () => {
            return request(app.getHttpServer())
                .post("/test")
                .set('Accept', 'application/json')
                .send(mockAnimal)
                .expect(HttpStatus.CREATED)
                .expect((response: request.Response) => {
                    const {
                        id,
                        name
                    } = response.body;
                    expect(typeof id).toBe("number"),
                    expect(name).toEqual(mockAnimal.name);
                })
            })
        })

    // describe("/test:id  (delete)", () => {
    //     it("it should delete a user", () => {
    //         request(app.getHttpServer())
    //             .post("/test")
    //             .set('Accept', 'application/json')
    //             .send(mockAnimal)
    //         let body = [];
    //         request(app.getHttpServer()).get("/test").expect((response: request.Response) => {
    //             body = response.body; 
    //         });
    //         console.log(body);
    //         return request(app.getHttpServer())
    //             .delete("/test:1")
    //             .expect(HttpStatus.OK)
    //     })

    // })
});
