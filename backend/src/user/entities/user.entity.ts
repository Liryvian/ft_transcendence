import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Game } from '../../pong/game/entities/game.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	is_intra: boolean;

	@Column({ unique: true, nullable: false })
	name: string;

	@Column({ nullable: false })
	@Exclude()
	password: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// @ManyToOne(() => Game, (game) => game.users)
	// game: Game;

	// @OneToOne(() => Game, (game) => game.user1)
	// game: number;

	// @OneToMany(() => Game, (game) => game.player_one)
	// @JoinColumn({
	// 	name: 'playerOne',
	// 	referencedColumnName: 'player_one',
	// 	foreignKeyConstraintName: 'custom_FK_player_one_to_user',
	// })
	// @JoinColumn({
	// 	name: 'playerTwo',
	// 	referencedColumnName: 'player_two',
	// 	foreignKeyConstraintName: 'custom_FK_player_two_to_user',
	// })
	// player: Game[];
}
