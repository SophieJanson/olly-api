import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { IsString, MaxLength, Length, IsNumber, IsDate } from "class-validator";
import User from "../users/entity"
import Match from "../matches/entity"
import Activity from "../activities/entity"

@Entity()
export default class WeeklyUpdate extends BaseEntity {
	
	@PrimaryGeneratedColumn() 
	id?: number;

	@IsString()
	@Length(4)
	// @Length(4, { each: true })
	@Column("text")
	category?: string;

	@IsString()
	@Length(3)
	@Column("text", {nullable: true})
	department?: string;

	@IsString()
	@Length(3)
	@Column("boolean", {default: false})
	postponedActivity?: boolean;

	@IsNumber()
	@MaxLength(2)
	@Column("int")
	weekNumber: number;

	@IsString()
	@Length(2)
	@Column("text")
	status: string;
  
	@ManyToOne(_ => User, user => user.id)
  	user: number

	@ManyToOne(_ => Match, match => match.id)
  	match: Match

	@ManyToOne(_ => Activity, activity => activity.id)
    activityId?: number;
}
