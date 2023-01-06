import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	is_intra: boolean;

	@Column({ unique: true, nullable: false })
	@IsNotEmpty()
	@MinLength(1)
	name: string;

	@Column({ nullable: false })
	@IsNotEmpty()
	@Exclude()
	password: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
