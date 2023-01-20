import { Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('friends')
@Index(['source', 'friend'], { unique: true })
export class Friend {
	@PrimaryGeneratedColumn()
	id: number;

	// @ManyToOne()
	// @JoinColumn({})
	// source: User;

	// @ManyToOne()
	// friend: User;
}
