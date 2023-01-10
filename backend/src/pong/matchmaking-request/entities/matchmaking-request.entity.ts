import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('matchmaking-requests')
export class MatchmakingRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// to be joined later on
    // One or Many ??? TBD
	// @ManyToOne(() => User,  user => user.id)
	// @JoinColumn({})
	// player_one: User;
	@Column()
	user_id: number;
}
