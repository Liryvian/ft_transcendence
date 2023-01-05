import {
	Check,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
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

	// for now empty customization
	@Column({ default: null })
	customization: string;

	@Column({ default: true })
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// to be joined later on
	// @ManyToOne(() => User,  user => user.id)
	// @JoinColumn({})
	// player_one: User;
	@Column()
	player_one: number;

	// @ManyToOne(() => User, user => user.id)
	// @JoinColumn({})
	// player_two: User;
	@Check(`"player_two" <> "player_one"`)
	@Column()
	player_two: number;
}
