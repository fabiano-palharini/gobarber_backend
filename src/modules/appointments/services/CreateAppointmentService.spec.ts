import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository  from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository  from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider  from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository : FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppointment', () => {

    beforeEach(() => {
      fakeAppointmentsRepository  = new FakeAppointmentsRepository();
      fakeNotificationsRepository  = new FakeNotificationsRepository();
      fakeCacheProvider = new FakeCacheProvider();
      createAppointmentService = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository, fakeCacheProvider);
    })


    it('should be able to create a new appointment', async () => {

      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4 , 10, 12).getTime();
      });

      const appointment = await createAppointmentService.execute({
          date: new Date(2020, 4, 15, 8),
          user_id: '123456',
          provider_id: '123123'
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('123123');
      expect(appointment.user_id).toBe('123456');
    });

    it('should not be able to create two appointments at the same time', async () => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4 , 10, 12).getTime();
      });

      const appointmentDate = new Date(2020, 4, 25, 11);

      const appointment = await createAppointmentService.execute({
          date: appointmentDate,
          user_id: '123456',
          provider_id: '123123'
      });

      await expect(createAppointmentService.execute({
            date: appointmentDate,
            user_id: '123456',
            provider_id: '123123'
          })).rejects.toBeInstanceOf(AppError);

    });


    it('should not be able to create an appointment on a past date', async() => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4 , 10, 12).getTime();
      });

      await expect(createAppointmentService.execute({
        date: new Date(2020, 4 , 10, 11),
        user_id: '123456',
        provider_id: '123123'
      })).rejects.toBeInstanceOf(AppError);
    });


    it('should not be able to create an appointment with same user being the provider', async() => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4 , 10, 12).getTime();
      });

      await expect(createAppointmentService.execute({
        date: new Date(2020, 4 , 10, 13),
        user_id: '123456',
        provider_id: '123456'
      })).rejects.toBeInstanceOf(AppError);
    });


    it('should not be able to create an appointment before 8 AM nor after 5PM', async() => {
      jest.spyOn(Date, 'now').mockImplementationOnce(() => {
        return new Date(2020, 4 , 10, 12).getTime();
      });

      await expect(createAppointmentService.execute({
        date: new Date(2020, 4 , 11, 7),
        user_id: '123456',
        provider_id: '123123'
      })).rejects.toBeInstanceOf(AppError);

      await expect(createAppointmentService.execute({
        date: new Date(2020, 4 , 11, 18),
        user_id: '123456',
        provider_id: '123123'
      })).rejects.toBeInstanceOf(AppError);
    });
})
