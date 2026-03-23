import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { ScheduleService } from '../../../contexts/academic/schedule/application/schedule.service';
import { Schedule } from '../../../contexts/academic/schedule/domain/schedule.entity';

describe('SchedulesController', () => {
  let controller: SchedulesController;
  let scheduleService: {
    findAll: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const schedule = new Schedule(
    'schedule-1',
    'course-1',
    'Lunes 08:00-10:00',
    'classroom-1',
  );

  beforeEach(async () => {
    scheduleService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [{ provide: ScheduleService, useValue: scheduleService }],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
  });

  it('findAll devuelve horarios', async () => {
    scheduleService.findAll.mockResolvedValue([schedule]);
    await expect(controller.findAll()).resolves.toEqual([schedule]);
  });

  it('findOne lanza not found si falta', async () => {
    scheduleService.findById.mockResolvedValue(null);
    await expect(controller.findOne('missing')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('create delega al servicio', async () => {
    scheduleService.create.mockResolvedValue(schedule);
    await expect(
      controller.create({
        courseId: 'course-1',
        slot: 'Lunes 08:00-10:00',
        classroomId: 'classroom-1',
      }),
    ).resolves.toEqual(schedule);
  });

  it('update devuelve horario actualizado', async () => {
    scheduleService.update.mockResolvedValue(schedule);
    await expect(
      controller.update('schedule-1', { slot: 'Martes 08:00-10:00' }),
    ).resolves.toEqual(schedule);
  });

  it('remove lanza not found si falta', async () => {
    scheduleService.delete.mockResolvedValue(false);
    await expect(controller.remove('missing')).rejects.toThrow(
      NotFoundException,
    );
  });
});
