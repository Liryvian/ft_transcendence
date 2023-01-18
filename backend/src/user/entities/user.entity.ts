import {
	Column,
	CreateDateColumn,
	Entity,
<<<<<<< HEAD
	OneToOne,
=======
>>>>>>> b96c07a64aa6a6e725c126de24ab2ecc33e91659
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
<<<<<<< HEAD
import { MatchmakingRequest } from '../../pong/matchmaking-request/entities/matchmaking-request.entity';
=======
>>>>>>> b96c07a64aa6a6e725c126de24ab2ecc33e91659

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

	@OneToOne(
		() => MatchmakingRequest,
		(matchRequest: MatchmakingRequest) => matchRequest.user,
	)
	matchmaking_request: MatchmakingRequest;
}
