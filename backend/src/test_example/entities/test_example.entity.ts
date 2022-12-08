import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity("tests")
export class TestExample 
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

}
