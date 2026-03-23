import { Injectable, Inject } from '@nestjs/common';
import { Schedule } from '../domain/schedule.entity';
import { IScheduleRepository, SCHEDULE_REPOSITORY } from '../domain/schedule.repository';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.findAll();
  }

  async findById(id: string): Promise<Schedule | null> {
    return this.scheduleRepository.findById(id);
  }

  async create(data: {
    courseId: string;
    slot: string;
    classroomId: string;
  }): Promise<Schedule> {
    const id = crypto.randomUUID();
    const schedule = new Schedule(id, data.courseId, data.slot, data.classroomId);
    return this.scheduleRepository.save(schedule);
  }

  async update(
    id: string,
    data: {
      courseId?: string;
      slot?: string;
      classroomId?: string;
    },
  ): Promise<Schedule | null> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) return null;

    schedule.courseId = data.courseId ?? schedule.courseId;
    schedule.slot = data.slot ?? schedule.slot;
    schedule.classroomId = data.classroomId ?? schedule.classroomId;

    return this.scheduleRepository.save(schedule);
  }

  async delete(id: string): Promise<boolean> {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) return false;
    await this.scheduleRepository.delete(id);
    return true;
  }
}
