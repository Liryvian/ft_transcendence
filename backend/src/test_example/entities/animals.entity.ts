import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('animals')
export class AnimalEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@ManyToOne(() => AnimalEntity, (o) => o.id, { cascade: true })
	parent: number;
}
