import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Achievement } from '../../achievements/entities/achievement.entity';
import { User } from '../../user/entities/user.entity';

@Entity('user_achievements')
export class UserAchievement {
	@PrimaryColumn({ name: 'user_id' })
	user_id: number;

	@PrimaryColumn({ name: 'achievement_id' })
	achievement_id: number;

	@ManyToOne(() => User, (user: User) => user.achievements, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
	users: User[];

	@ManyToOne(() => Achievement, (a: Achievement) => a.name, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn([{ name: 'achievement_id', referencedColumnName: 'id' }])
	achievements: Achievement[];

	// @ManyToMany(() => Achievement)
	// achievements: Achievement[];
}
