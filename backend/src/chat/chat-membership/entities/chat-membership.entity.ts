import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { MembershipState } from './chat/membership-state/entities/membership-state.entity';
import { Chatroom } from './chat/chatroom/chatroom.entity';

@Entity('chatMemberships')
export class ChatMembership {
  // @ManyToOne(() => Role) // connected to USER -> ID
  // user_id: string;

  @OneToOne((type) => Chatroom, (chatroom) => chatroom.id)
  chat_id: string;

  @OneToOne((type) => MembershipState, (membershipState) => membershipState.id)
  membership_id: MembershipState;
}

// @OneToMany(type => Photo, photo => photo.user)
// photos: Photo[];
