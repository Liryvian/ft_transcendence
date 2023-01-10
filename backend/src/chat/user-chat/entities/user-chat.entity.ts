import {
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

//onDelete and onUpdate should be looked at

@Entity('user_chat')
export class UserChat {
	@PrimaryGeneratedColumn()
	id: number;

	@PrimaryColumn({ name: 'user_id' })
	user_id: number;

	@PrimaryColumn({ name: 'chatroom_id' })
	chatroom_id: number;

	@ManyToOne(() => User, (user) => user.id, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	users: User[];

	@ManyToOne(() => Chatroom, (chatroom) => chatroom.id, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	})
	@JoinColumn([{ name: 'chatroom_id', referencedColumnName: 'id' }])
	courses: Chatroom[];
}

// @Entity('student_course')
// export class StudentCourse {
//     @PrimaryColumn({ name: 'student_id' })
//     studentId: number;
//
//     @PrimaryColumn({ name: 'course_id' })
//     courseId: number;
//
//     @ManyToOne(
//         () => Student,
//         student => student.course,
//         {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
//     )
//     @JoinColumn([{ name: 'student_id', referencedColumnName: 'id' }])
//     students: Student[];
//
//     @ManyToOne(
//         () => Course,
//         course => course.student,
//         {onDelete: 'NO ACTION', onUpdate: 'NO ACTION'}
//     )
//     @JoinColumn([{ name: 'course_id', referencedColumnName: 'id' }])
//     courses: Course[];
// }
