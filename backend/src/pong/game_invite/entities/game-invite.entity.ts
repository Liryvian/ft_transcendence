import { User } from '../../../user/entities/user.entity';
import {
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('game_invites')
export class GameInvite {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => User, (user) => user.invite)
	players: User[];
}