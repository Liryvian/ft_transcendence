import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum validRelationships {
	FRIEND = 'friend',
	BLOCKED = 'blocked',
}

@Entity('user_relationships')
export class UserRelationship {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => User, (user: User) => user.connections) //connection
	@JoinColumn({ name: 'connection' })
	connection: User[];

	@Column()
	type: string;
}
