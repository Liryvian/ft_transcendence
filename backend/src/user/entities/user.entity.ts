import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	is_intra: boolean;

	@Column({ unique: true, nullable: false })
	name: string;

	@Exclude()
	@Column({ nullable: false })
	password: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
