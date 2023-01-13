import {
	Column,
	Entity,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { UserchatRole } from '../../userchat-role/entities/userchat-role.entity';

@Entity('roles')
export class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	// @ManyToOne(() => UserchatRole, (userchatrole) => userchatrole.id, {
	// 	onDelete: 'CASCADE',
	// 	onUpdate: 'CASCADE',
	// })
	// users: UserchatRole[];
}
