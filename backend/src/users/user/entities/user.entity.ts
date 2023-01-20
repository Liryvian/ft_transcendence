import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { MatchmakingRequest } from '../../../pong/matchmaking-request/entities/matchmaking-request.entity';
import { Game } from '../../../pong/game/entities/game.entity';
import { IsOptional } from 'class-validator';
import { GameInvite } from '../../../pong/game_invite/entities/game-invite.entity';
import { Chat } from '../../../chats/chat/entities/chat.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	is_intra: boolean;

	@Column({ unique: true, nullable: false })
	name: string;

	@Column()
	@Exclude()
	password: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	// @IsOptional()
	// @

	@IsOptional()
	@OneToOne(
		() => MatchmakingRequest,
		(matchRequest: MatchmakingRequest) => matchRequest.user,
	)
	matchmaking_request: MatchmakingRequest;

	@Exclude()
	@IsOptional()
	@OneToMany(() => Game, (game: Game) => game.player_one)
	games_as_player_one: Game[];

	@Exclude()
	@IsOptional()
	@OneToMany(() => Game, (game: Game) => game.player_two)
	games_as_player_two: Game[];

	@Expose()
	@IsOptional()
	get games(): Game[] {
		//  if games_as_player_one/two are null set them = []
		return [
			...(this.games_as_player_one ?? []),
			...(this.games_as_player_two ?? []),
		];
	}

	@IsOptional()
	@ManyToOne(() => GameInvite, (invite) => invite.players)
	@JoinColumn({ name: 'invite' })
	invite: GameInvite;

	@ManyToMany(() => Chat, (chat) => chat.users, {
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
	})
	@JoinTable({
		name: 'user_chats',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'chat_id',
			referencedColumnName: 'id',
		},
	})
	chats: Chat[];
}
