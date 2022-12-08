import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("animals")
export class Animal 
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
