import { IsEnum, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { EventsNames } from './events.enums';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(EventsNames)
  name: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
