import { startOfHour } from 'date-fns';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

/**
 * 1 - recebe as informações
 * 2 - trata erros/excecoes
 * 3 - acesso ao repositório
 */

interface AppointmentDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {

  constructor(private appointmentsRepository: IAppointmentsRepository) {}


  public async execute({
    provider_id,
    date,
  }: AppointmentDTO): Promise<Appointment> {


    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    // it creates an instance of the appointment but it does not save it into the database
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
