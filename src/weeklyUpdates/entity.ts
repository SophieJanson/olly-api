import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn
} from "typeorm";
import { MaxLength, Length, IsNumber } from "class-validator";
import User from "../users/entity";
import Match from "../matches/entity";
import Activity from "../activities/entity";

@Entity()
export default class WeeklyUpdate extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @Length(4)
  // @Length(4, { each: true })
  @Column("text")
  category: string;

  @Length(3)
  @Column("text")
  connectionType: string;

  @Length(3)
  @Column("boolean")
  postponedActivity: boolean;

  @IsNumber()
  @MaxLength(2)
  @Column("int")
  weekNumber: number;

  // @IsDate()
  // @Column()
  // time: Date;

  //@IsString()
  @Length(2)
  @Column("text")
  status: string;

  @ManyToOne(_ => User, user => user.id)
  user: User;

  @ManyToOne(_ => Match, match => match.id)
  match: Match;

  @OneToOne(_ => Activity)
  @JoinColumn()
  activity: Activity;
}
