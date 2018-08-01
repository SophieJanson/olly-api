<<<<<<< HEAD
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
=======
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
>>>>>>> develop
import { MinLength, IsString } from "class-validator";
import WeeklyUpdate from "../weeklyUpdates/entity";

@Entity()
export default class Activity extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

<<<<<<< HEAD
	@IsString()
	@MinLength(2)
	@Column("text")
	activityName: string;

	@OneToMany(_ => WeeklyUpdate, weeklyUpdate => weeklyUpdate.activityId)
	weeklyUpdates: number[]
=======
  @IsString()
  @MinLength(2)
  @Column("text")
  activityName: string;

  @OneToMany(_ => WeeklyUpdate, WeeklyUpdate => WeeklyUpdate.activityId)
  weeklyUpdate: number[];
>>>>>>> develop
}
