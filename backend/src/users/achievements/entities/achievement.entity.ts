import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievements')
export class Achievement {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;
}
