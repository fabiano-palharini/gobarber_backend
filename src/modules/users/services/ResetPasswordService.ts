import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
// import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepositories';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IMailProvider  from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
      const userToken = await this.userTokensRepository.findByToken(token);

      if (!userToken) {
          throw new AppError('Token not found');
      }

      const user = await this.usersRepository.findById(userToken?.user_id);

      if (!user) {
        throw new AppError('User not found');
      }

      const tokenCreatedAt = userToken.created_at;
      const compareDate = addHours(tokenCreatedAt, 2);
      if (isAfter(Date.now(), compareDate)) {
        throw new AppError('Token expired');
      }

      user.password = await this.hashProvider.generateHash(password);

      await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
