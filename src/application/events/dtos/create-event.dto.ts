import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { EventsNames } from '../../../@domain/events/enums/events.enums';
import { Type } from 'class-transformer';

export class ConsentDto {
  @IsEnum(EventsNames)
  id: string;

  @IsBoolean()
  enabled: boolean;
}

export class UserDto {
  @IsUUID()
  id: string;
}

export class CreateEventDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsentDto)
  consents: ConsentDto[];
}
