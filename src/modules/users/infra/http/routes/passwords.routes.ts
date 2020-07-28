import { Router } from 'express';
import  ForgottenPasswordController from '../controllers/ForgottenPasswordController';
import  ResetPasswordController from '../controllers/ResetPasswordController';
import { Segments, celebrate, Joi } from 'celebrate';

const passwordRouter = Router();
const forgottenPasswordController = new ForgottenPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', celebrate({
  [Segments.BODY]: {
    email: Joi.string().email().required(),
  }
}), forgottenPasswordController.create);

passwordRouter.post('/reset', celebrate({
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().required().valid(Joi.ref('password')),
  }
}), resetPasswordController.create);

export default passwordRouter;
