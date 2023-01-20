import { IsIn } from 'class-validator';
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

const validRelationships = ['friend', 'blocked'];

@Entity('user_relationships')
export class UserRelationship {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => User, (user: User) => user.connections) //connection
	@JoinColumn({ name: 'connection' })
	connection: User[];

	// @ManyToOne(() => User, (user: User) => user.id, { eager: true }) //connection
	// @JoinColumn({ name: 'connection_from' })
	// connection_from: User;
	// connection_from
	// connection_to
	@Column()
	@IsIn(validRelationships)
	type: string;
}
