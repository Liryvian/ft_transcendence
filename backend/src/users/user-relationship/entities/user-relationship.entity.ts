import {
	Check,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum validRelationships {
	FRIEND = 'friend',
	BLOCKED = 'blocked',
	NONE = 'none',
}

@Entity('user_relationships')
@Check(`"source" <> "target"`) // 				makes [2,2] impossible
export class UserRelationship {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user: User) => user.relationshipSource, {
		eager: true,
	})
	@JoinColumn({ name: 'source' })
	source: User;

	@ManyToOne(() => User, (user: User) => user.relationshipTarget, {
		eager: true,
	})
	@JoinColumn({ name: 'target' })
	target: User;

	@Column({ default: validRelationships.NONE })
	type: string;
}
