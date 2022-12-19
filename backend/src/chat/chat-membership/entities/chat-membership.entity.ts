import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { MembershipState } from '../../membership-state/entities/membership-state.entity';
import { Chatroom } from '../../chatroom/entities/chatroom.entity';

@Entity('chatMemberships')
export class ChatMembership {
  // @ManyToOne(type => User, user => user.id) // connected to USER -> ID
  // user_id: User;

  @OneToOne((type) => Chatroom, (chatroom) => chatroom.id)
  chat_id: Chatroom;

  @OneToOne((type) => MembershipState, (membershipState) => membershipState.id)
  membership_id: MembershipState;
}
