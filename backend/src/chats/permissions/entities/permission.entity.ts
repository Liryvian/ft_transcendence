import { ChatUserPermission } from '../../chat-user-permissions/entities/chat-user-permission.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true, nullable: false })
	name: string;

	// is this direction of the relation needed?
	// as in: will we ever query the permissions table to figure out which permissions
	// are set for which chat/user combination?
	// I think it will mostly go through either the user or the chat...
	@OneToMany(() => ChatUserPermission, (cup) => cup.permissions)
	relation: ChatUserPermission[];
}
