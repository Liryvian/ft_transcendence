import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

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

	// @Column()
	// avatar: string;

	// @Column()
	// status: string;
	//
	// @Column()
	// wins: number;
	//
	// @Column()
	// draws: number;
	//
	// @Column()
	// losses: number;
}
