import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Unique(['name'])
@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	is_intra: boolean;

	@Column({ unique: true })
	name: string;

	@Column()
	@Exclude()
	password: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
