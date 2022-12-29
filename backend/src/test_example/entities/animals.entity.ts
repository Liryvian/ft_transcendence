import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("animals")
export class AnimalEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
