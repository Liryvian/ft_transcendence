import { User } from '../../../user/entities/user.entity';
import {
	Check,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('game_invites')
export class GameInvite {
	@PrimaryGeneratedColumn()
	id: number;

	// // Will either be linked with user, or a view table created
	// @Column()
	// source_id: number;

	// // Will either be linked with user, or a view table created
	// @Check(`"target_id" <> "source_id"`)
	// @Column()
	// target_id: number;

	@OneToMany(() => User, (user) => user.invite)
	players: User[];
}
