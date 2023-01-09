import {Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Chatroom} from "../../chat/chatroom/entities/chatroom.entity";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    //
    // @ManyToMany((type) => Chatroom, (chatroom) => chatroom.id)
    // @JoinColumn({ name: 'chatroom_id' })
    // chatroom_id: number;

    @Column()
	name: string;
}
