import { Request, Response } from "express";
import { container } from 'tsyringe';
import SendForgottenPasswordEmailService from '@modules/users/services/SendForgottenPasswordEmailService';

export default class ForgottenPasswordController {
    public async create(request: Request, response: Response): Promise<Response> {
      const { email, password } = request.body;


      const sendForgottenPasswordEmailService = container.resolve(SendForgottenPasswordEmailService);

      await sendForgottenPasswordEmailService.execute({
        email,
      });

      return response.status(204).json();
    }
}
