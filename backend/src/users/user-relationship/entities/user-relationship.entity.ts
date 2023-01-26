import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum validRelationships {
	FRIEND = 'friend',
	BLOCKED = 'blocked',
}

@Entity('user_relationships')
@Index(['source_id', 'target_id'], { unique: true })
export class UserRelationship {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user: User) => user.relationshipSource)
	@JoinColumn({ name: 'source_id' })
	source_id: User;

	@ManyToOne(() => User, (user: User) => user.relationshipTarget)
	@JoinColumn({ name: 'target_id' })
	target_id: User;

	// @Column()
	// specifier_id: number;

	@Column()
	type: string;
}
