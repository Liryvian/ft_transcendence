import { ChatUserPermission } from '../../chat-user-permissions/entities/chat-user-permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	@OneToMany(() => ChatUserPermission, (cup) => cup.permissions)
	relation: ChatUserPermission[];
}
