import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Exclude } from "class-transformer";
import { MinLength, IsString, IsEmail, MaxLength } from "class-validator";

@Entity()
export default class WeeklyUpdate extends BaseEntity {
  @PrimaryGeneratedColumn() id?: number;

  @IsString()
  @Length(4, { each: true })
  @Column("text")
  category: string;

  @IsString()
  @Length(3, { each: true })
  @Column("text")
  connectionType: string;

  @IsString()
  @Length(3, { each: true })
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
  @Length(2, { each: true })
  @Column("text")
  status: string;
  @Column("text") status: string;
  @Column("text") connectionType: string;

  @IsString()
  @Length(3, { each: true })
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
  @Length(2, { each: true })
  @Column("text")
  status: string;
  @Column("text") status: string;

  @IsString()
  @Length(3, { each: true })
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
  @Length(2, { each: true })
  @Column("text")
  status: string;
  @Column("text") status: string;

  @IsString()
  @Length(3, { each: true })
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
  @Length(2, { each: true })
  @Column("text")
  status: string;
  @Column("text") status: string;
  // @Column("text")
  // firstName: string;

  // @IsString()
  // @MinLength(2)
  // @Column("text")
  // lastName: string;

  // @IsEmail()
  // @Column("text")
  // email: string;

  // @IsString()
  // @MinLength(8)
  // @Column("text")
  // @Exclude({ toPlainOnly: true })
  // password: string;
}
