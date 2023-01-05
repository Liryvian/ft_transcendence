import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game-invites')
export class GameInvite {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	source_id: number;

	// Will either be linked with user, or a view table created
	@Column()
	target_id: number;
}
