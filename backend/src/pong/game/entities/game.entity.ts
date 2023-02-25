import { User } from '../../../users/user/entities/user.entity';
import {
	Check,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('games')
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 0 })
	score_player_one: number;

	@Column({ default: 0 })
	score_player_two: number;

	@Column({ default: 0 })
	score_to_win?: number;

	@Column({ default: null }) // '#FFC0CB'
	background_color?: string;

	@Column({ default: false })
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToOne(() => User, (user) => user.id, {
		nullable: false,
	})
	@JoinColumn({ name: 'player_one' })
	player_one: User;

	@ManyToOne(() => User, (user) => user.id, {
		nullable: false,
	})
	@Check(`"player_one" <> "player_two"`)
	@JoinColumn({ name: 'player_two' })
	player_two: User;
}
