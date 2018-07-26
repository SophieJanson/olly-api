import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { MinLength, IsString } from "class-validator";

@Entity()
export default class Activity extends BaseEntity {
	
	@PrimaryGeneratedColumn() 
	id?: number;

	@IsString()
	@MinLength(2)
	@Column("text")
	activity: string[];

}
