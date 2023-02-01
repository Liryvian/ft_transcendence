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
import { GameInvite } from '../../../pong/game_invite/entities/game-invite.entity';
import { UserRelationship } from '../../user-relationship/entities/user-relationship.entity';
import { Achievement } from '../../achievements/entities/achievement.entity';
import { ChatUserPermission } from '../../../chats/chat-user-permissions/entities/chat-user-permission.entity';
import { IsArray, IsNumber } from 'class-validator';
import { Permission } from '../../../chats/permissions/entities/permission.entity';
var groupBy = require('lodash/groupBy');

export class UserInChat {
	@IsNumber()
	chat_id: number;

	@IsArray()
	permissions: Permission[];
}

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	is_intra: boolean;

	@Column({ nullable: true })
	intra_id: number;

	@Column({ nullable: true })
	intra_login: string;

	@Column({ unique: true, nullable: false })
	name: string;

	@Column({ nullable: true })
	@Exclude()
	password: string;

	@Column({ nullable: true })
	avatar: string;

	@OneToOne(
		() => MatchmakingRequest,
		(matchRequest: MatchmakingRequest) => matchRequest.user,
	)
	matchmaking_request: MatchmakingRequest;

	@Exclude()
	@OneToMany(() => Game, (game: Game) => game.player_one)
	games_as_player_one: Game[];

	@Exclude()
	@OneToMany(() => Game, (game: Game) => game.player_two)
	games_as_player_two: Game[];

	@Expose()
	get games(): Game[] {
		//  if games_as_player_one/two are null set them = []
		return [
			...(this.games_as_player_one ?? []),
			...(this.games_as_player_two ?? []),
		];
	}

	@ManyToOne(() => GameInvite, (invite) => invite.players)
	@JoinColumn({ name: 'invite' })
	invite: GameInvite;

	@ManyToMany(() => Achievement, {
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
	})
	@JoinTable({
		name: 'user_achievements',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'achievement_id',
			referencedColumnName: 'id',
		},
	})
	achievements: Achievement[];

	@Exclude()
	@OneToMany(() => UserRelationship, (r: UserRelationship) => r.source_id)
	@JoinColumn({ name: 'relationshipSource' })
	relationshipSource: UserRelationship[];

	@Exclude()
	@OneToMany(() => UserRelationship, (r: UserRelationship) => r.target_id)
	@JoinColumn({ name: 'relationshipTarget' })
	relationshipTarget: UserRelationship[];

	@Expose()
	get relationships(): UserRelationship[] {
		return [
			...(this.relationshipSource ?? []),
			...(this.relationshipTarget ?? []),
		];
	}

	// @Exclude()
	@OneToMany(() => ChatUserPermission, (cup) => cup.users, { eager: true })
	chatuser: ChatUserPermission[];

	@Expose()
	get chats(): UserInChat[] {
		return this.chatuser.reduce((acc, curr) => {
			const index = acc.findIndex((obj) => obj.chat_id == curr.chat_id);
			if (index === -1) {
				acc.push({ chat_id: curr.chat_id, permissions: [curr.permissions] });
			} else {
				acc[index].permissions.push(curr.permissions);
			}
			return acc;
		}, []);
	}

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
