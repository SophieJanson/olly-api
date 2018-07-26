import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { MinLength, IsString, IsEmail, MaxLength, Length, IsNumber, IsDate } from "class-validator";

@Entity()
export default class WeeklyUpdate extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @IsString()
  @Length(4)
  // @Length(4, { each: true })
  @Column("text")
  category: string;

  @IsString()
  @Length(3)
  @Column("text")
  connectionType: string;

  @IsString()
  @Length(3)
  @Column("boolean")
  postponedActivity: boolean;

  @IsNumber()
  @MaxLength(2)
  @Column("int")
  weekNumber: number;

  @IsDate()
  @Column()
  time: Date;

  @IsString()
  @Length(2)
  @Column("text")
  status: string;
  
  
}
