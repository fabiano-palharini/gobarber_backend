import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmentsController';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();


/** this will be applied to all routes
 * to use to a specific route use this notatio: appointmentsRouter.get('/', ensureAuthenticated, async (request, response) => {
 */
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   // const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
