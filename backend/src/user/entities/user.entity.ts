import {
	Column,
	CreateDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';
import { MatchmakingRequest } from '../../pong/matchmaking-request/entities/matchmaking-request.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	is_intra: boolean;

	@Column({ unique: true, nullable: false })
	@IsNotEmpty()
	@MinLength(1)
	name: string;

	@Column({ nullable: false })
	@IsNotEmpty()
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
