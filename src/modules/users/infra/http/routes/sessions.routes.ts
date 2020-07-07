import { Router } from 'express';
import  SessionsController from '../controllers/SessionsController';
import { celebrate, Segments } from 'celebrate';
import Joi from '@hapi/joi';

const sessionsRouter = Router();
const sessionsControllers = new SessionsController();

sessionsRouter.post('/', celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }
}), sessionsControllers.create);

export default sessionsRouter;
