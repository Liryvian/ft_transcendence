import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Unique(['name'])
@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	is_intra: boolean;

	@Column()
	name: string;

	@Column()
	@Exclude()
	password: string;
}
