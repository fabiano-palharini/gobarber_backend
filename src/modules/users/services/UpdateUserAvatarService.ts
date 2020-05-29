import path from 'path';
import { injectable, inject } from 'tsyringe';
import fs from 'fs';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import IUsersRepository from '../repositories/IUsersRepositories';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface Request {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, avatarFileName }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not authenticated.');
    }

    if (user.avatar) {
        await this.storageProvider.deleteFile(user.avatar);

    }
    const filename = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = filename;
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
