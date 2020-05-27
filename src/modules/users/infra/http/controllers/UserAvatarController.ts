import { Request, Response } from "express";
import { container } from 'tsyringe';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
    public async update(request: Request, response: Response): Promise<Response> {
      const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

      const user = await updateUserAvatarService.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename,
      });

      delete user.password;

      return response.json(user);
    }
}
