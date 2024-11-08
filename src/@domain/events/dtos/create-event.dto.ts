import { IsEnum, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { EventsNames } from '../enums/events.enums';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(EventsNames)
  name: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
