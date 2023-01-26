import {
	Check,
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
@Check(`"source_id" <> "target_id"`) // 				makes [2,2] impossible
@Index(['source_id', 'target_id'], { unique: true }) // makes [2,1] unique from [2,1] but not from [1,2]
export class UserRelationship {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user: User) => user.relationshipSource, {
		eager: true,
	})
	@JoinColumn({ name: 'source_id' })
	source_id: User;

	@ManyToOne(() => User, (user: User) => user.relationshipTarget, {
		eager: true,
	})
	@JoinColumn({ name: 'target_id' })
	target_id: User;

	// @Column()
	// specifier_id: number;

	@Column()
	type: string;
}
