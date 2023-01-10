import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Chatroom } from '../../chat/chatroom/entities/chatroom.entity';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany((type) => Chatroom, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinTable({
		name: 'user-chat',
		joinColumn: {
			name: 'user_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'chat_id',
			referencedColumnName: 'id',
		},
	})
	chatroom?: Chatroom[];
}

// @Entity('student')
// export class Student {
//     @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
//     id: number;
//
//     @Column('varchar', { name: 'student_name', length: 255, unique: true })
//     studentName: string;
//
//     @ManyToMany(
//         () => Course,
//         course => course.students, //optional
//         {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'})
//     @JoinTable({
//         name: 'student_course',
//         joinColumn: {
//             name: 'student_id',
//             referencedColumnName: 'id',
//         },
//         inverseJoinColumn: {
//             name: 'course_id',
//             referencedColumnName: 'id',
//         },
//     })
//     courses?: Course[];
