import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { SCHEDULE_REPOSITORY } from '../domain/schedule.repository';
import { Schedule } from '../domain/schedule.entity';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let scheduleRepo: {
    findAll: jest.Mock;
    findById: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
  };

  const schedule = new Schedule(
    'schedule-1',
    'course-1',
    'Lunes 08:00-10:00',
    'classroom-1',
  );

  beforeEach(async () => {
    scheduleRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: SCHEDULE_REPOSITORY, useValue: scheduleRepo },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('findAll devuelve horarios', async () => {
    scheduleRepo.findAll.mockResolvedValue([schedule]);
    await expect(service.findAll()).resolves.toEqual([schedule]);
  });

  it('create guarda courseId, slot y classroomId', async () => {
    scheduleRepo.save.mockImplementation(async (value: Schedule) => value);
    const result = await service.create({
      courseId: 'course-1',
      slot: 'Martes 10:00-12:00',
      classroomId: 'classroom-2',
    });

    expect(result.courseId).toBe('course-1');
    expect(result.slot).toBe('Martes 10:00-12:00');
    expect(result.classroomId).toBe('classroom-2');
  });

  it('update devuelve null si no existe', async () => {
    scheduleRepo.findById.mockResolvedValue(null);
    await expect(service.update('missing', { slot: 'X' })).resolves.toBeNull();
  });

  it('update modifica el horario', async () => {
    scheduleRepo.findById.mockResolvedValue(schedule);
    scheduleRepo.save.mockImplementation(async (value: Schedule) => value);

    const result = await service.update('schedule-1', {
      classroomId: 'classroom-9',
    });

    expect(result?.classroomId).toBe('classroom-9');
    expect(scheduleRepo.save).toHaveBeenCalledWith(schedule);
  });

  it('delete devuelve false si falta', async () => {
    scheduleRepo.findById.mockResolvedValue(null);
    await expect(service.delete('missing')).resolves.toBe(false);
  });

  it('delete elimina si existe', async () => {
    scheduleRepo.findById.mockResolvedValue(schedule);
    scheduleRepo.delete.mockResolvedValue(undefined);

    await expect(service.delete('schedule-1')).resolves.toBe(true);
    expect(scheduleRepo.delete).toHaveBeenCalledWith('schedule-1');
  });
});
