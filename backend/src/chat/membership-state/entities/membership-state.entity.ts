import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('membershipStates')
export class MembershipState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
