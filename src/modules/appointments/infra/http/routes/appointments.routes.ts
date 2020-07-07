import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import Joi from '@hapi/joi';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();


/** this will be applied to all routes
 * to use to a specific route use this notatio: appointmentsRouter.get('/', ensureAuthenticated, async (request, response) => {
 */
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   // const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

appointmentsRouter.post('/', celebrate({
  [Segments.BODY]: {
    provider_id: Joi.string().uuid().required(),
    date: Joi.date()
  }
}), appointmentsController.create);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
