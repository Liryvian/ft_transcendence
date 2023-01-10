import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Entity('chatrooms')
export class Chatroom {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => User, (user) => user.id, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	user?: User[];

	@Column()
	visibility: string;

	@Column()
	password: string;
}

// @Entity('course')
// export class Course {
// 	@PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
// 	id: number;
//
// 	@Column('varchar', { name: 'course_name', length: 255, unique: true })
// 	courseName: string;
//
// 	@ManyToMany(
// 		() => Student,
// 		student => student.courses,
// 		{onDelete: 'NO ACTION', onUpdate: 'NO ACTION',},
// 	)
// 	students?: Student[];
// }
