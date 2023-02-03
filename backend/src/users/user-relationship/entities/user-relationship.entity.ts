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
	NONE = 'none',
	FRIEND = 'friend',
	BLOCKED = 'blocked',
}

@Entity('user_relationships')
@Check(`"source_id" <> "target_id"`) // 				makes [2,2] impossible
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

	@Column({ default: validRelationships.NONE })
	type: string;
}
