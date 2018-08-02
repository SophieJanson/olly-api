import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { Length, IsNumber } from "class-validator";
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
  @Column("text", { nullable: true })
  department: string;

  @Column("boolean", { default: false })
  postponedActivity: boolean;

  @IsNumber()
  @Column("int", { default: 1 })
  weekNumber?: number;

  @Length(2)
  @Column("text", { default: "pending" })
  status?: string;

  @ManyToOne(_ => User, user => user.id)
  userId: number;

  @ManyToOne(_ => Match, match => match.id)
  match: Match;

  @ManyToOne(_ => Activity, activity => activity.id)
  activityId: number;
}
