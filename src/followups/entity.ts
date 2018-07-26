import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import Match from "../matches/entity"
import User from "../users/entity";


@Entity()
export default class FollowUp extends BaseEntity {
  
	@PrimaryGeneratedColumn() 
	id?: number;

	@Column("text")
	rating: string
	
	@ManyToOne(_ => Match, match => match.id)
	matches: number;

	@ManyToOne(_ => User, user => user.id) 
	user: number;
}
