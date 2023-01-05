import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Game } from '../../game/entities/game.entity';

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

	@OneToMany(() => Game, (game) => /^player_[12]{1}$/)
	@JoinColumn()
	games: Game[];
}

// export class User {
//     ...
//     @OneToMany(() => Game, (Game) => /^p[12]{1}$/)
//     player_in_game: Game[];
// }
