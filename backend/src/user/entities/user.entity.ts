import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	is_intra: boolean;

	@Column({ unique: true })
	@IsString()
	@IsNotEmpty()
	name: string;

	@Column()
	@Exclude()
	@IsString()
	@IsNotEmpty()
	password: string;

	@CreateDateColumn()
	@IsDate()
	created_at: Date;

	@UpdateDateColumn()
	@IsDate()
	updated_at: Date;
}
