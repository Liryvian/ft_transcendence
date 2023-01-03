import { User } from '../../user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('games')
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 0 })
	score_user_one: number;

	@Column({ default: 0 })
	score_user_two: number;

	// for now empty customization
	@Column({ default: null })
	customization: string;

	@Column({ default: true })
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(() => User, (user_one) => user_one.id, { cascade: true })
	@JoinColumn()
	user_one: User;

	@OneToOne(() => User, (user_two) => user_two.id, { cascade: true })
	@JoinColumn()
	user_two: User;
}
