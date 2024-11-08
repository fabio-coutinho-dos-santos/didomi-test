import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ConsentDto,
  CreateEventDto,
} from 'src/application/events/dtos/create-event.dto';
import { IEventsRepository } from '../repositories/events.repository.interface';
import { IUsersRepository } from 'src/@domain/users/repositories/users.repository.interface';
import { Event } from '../entities/event.entity';
import { EventsNames } from '../enums/events.enums';
import { IEventsHistoryRepository } from '../repositories/events-history.repository.interface';

@Injectable()
export class CreateEventUseCase {
  @Inject('IEventsRepository')
  private readonly eventsRepository: IEventsRepository;

  @Inject('IUsersRepository')
  private readonly usersRepository: IUsersRepository;

  @Inject('IEventsHistoryRepository')
  private readonly eventsHistoryRepository: IEventsHistoryRepository;

  async execute(input: CreateEventDto): Promise<any> {
    const { user, consents } = input;

    const userStored = await this.usersRepository.findByField('id', user.id);

    if (!userStored) {
      throw new UnprocessableEntityException('User not found');
    }

    await this.storeEventsHistory(user.id, consents);
    await this.storeEvents(user.id, consents);
  }

  private async storeEventsHistory(
    userId: string,
    consents: ConsentDto[],
  ): Promise<void> {
    await Promise.all(
      consents.map(async (consent) => {
        const event = new Event(
          userId,
          consent.id as EventsNames,
          consent.enabled,
        );
        await this.eventsHistoryRepository.create(event);
      }),
    );
  }

  private async storeEvents(
    userId: string,
    consents: ConsentDto[],
  ): Promise<void> {
    await Promise.all(
      consents.map(async (consent) => {
        const event = new Event(
          userId,
          consent.id as EventsNames,
          consent.enabled,
        );
        console.log(await this.eventsRepository.createOrUpdate(event));
      }),
    );
  }
}
