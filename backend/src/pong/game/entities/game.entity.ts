import { User } from '../../../user/entities/user.entity';
import {
	Check,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('games')
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 0 })
	score_player_one: number;

	@Column({ default: 0 })
	score_player_two: number;

	// for now empty customization on initialization
	@Column({ default: null })
	customization: string;

	@Column({ default: true })
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@ManyToMany(() => User, (u) => u)
	@JoinTable()
	users: User[];

	// @OneToMany(() => User, (user) => user.game)
	// users: User[];

	// @OneToOne(() => User, (user) => user.game)
	// @JoinColumn()
	// user1: User;

	// @OneToOne(() => User, (user) => user.game)
	// @JoinColumn()
	// user2: User;

	// @ManyToOne(() => User, (user) => user.player, {
	// 	nullable: false,
	// })
	// @JoinColumn({ name: 'playerOneId' })
	// player_one: User;
	// @JoinColumn({
	// 	name: 'playerOne',
	// 	referencedColumnName: 'id',
	// 	foreignKeyConstraintName: 'custom_FK_player_one_to_user',
	// })

	// @ManyToOne(() => User)
	// @JoinColumn({
	// 	name: 'playerTwo',
	// 	referencedColumnName: 'id',
	// 	foreignKeyConstraintName: 'custom_FK_player_two_to_user',
	// })
	// @Check(`"playerOne" <> "playerTwo"`)
	// player_two: User;

	// to be joined later on
	// @ManyToOne(() => User,  user => user.id)
	// @JoinColumn({})
	// player_one: User;
	// @Column()
	// player_one: number;

	// @ManyToOne(() => User, user => user.id)
	// @JoinColumn({})
	// player_two: User;
	// @Check(`"player_two" <> "player_one"`)
	// @Column()
	// player_two: number;
}
