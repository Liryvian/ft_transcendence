import {PrimaryColumn } from 'typeorm';

export class UserchatRole {
	// @PrimaryColumn({ name: 'userchat_id' })
	// user_id: number;

	@PrimaryColumn({ name: 'role_id' })
	role_id: number;

	// @ManyToOne(() => UserChat, (userChat) => userChat.id, {
	// 	onDelete: 'CASCADE',
	// 	onUpdate: 'CASCADE',
	// })
	// @JoinColumn([{ name: 'chatuser_id', referencedColumnName: 'id' }])
	// users: UserChat[];

	// @ManyToOne(() => Role, (role) => role.id, {
	// 	onDelete: 'CASCADE',
	// 	onUpdate: 'CASCADE',
	// })
	// @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
	// courses: Role[];
}
