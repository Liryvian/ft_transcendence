import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Seasnail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    color: string;

    @Column({unique: true})
    email: string;

    @Column()
	password: string;
}
