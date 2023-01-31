import { Chat_User_Permissions } from '../../chat_user_permission/entities/chat_user_permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chatpermissions')
export class ChatPermission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	@OneToMany(() => Chat_User_Permissions, (cup) => cup.permissions)
	chatuser: Chat_User_Permissions[];
}
