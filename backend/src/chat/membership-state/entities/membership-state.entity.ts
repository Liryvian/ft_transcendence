import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('membership_states')
export class MembershipState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
