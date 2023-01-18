import { User } from '../../../user/entities/user.entity';
import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('matchmaking_requests')
export class MatchmakingRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@OneToOne(() => User, (user: User) => user.matchmaking_request)
	@JoinColumn({
		name: 'invite_users',
	})
	user: User;
}
