import { injectable, inject } from 'tsyringe';
// import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepositories';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IMailProvider  from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import path from 'path';

interface IRequest {
  email: string;
}

@injectable()
class SendForgottenPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
      const user = await this.usersRepository.findByEmail(email);

      if (!user) {
        throw new AppError('User does not exist.')
      }

      const { token } = await this.userTokensRepository.generate(user.id);

      const forgottenPasswordTemplate = path.resolve(__dirname, '..', 'templates', 'forgot_password.hbs');

      await this.mailProvider.sendMail({
        to: {name: user.name, email: user.email},
        subject: 'GoBarber - Password Recovery',
        templateData: {
          file: forgottenPasswordTemplate,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`,
          }
        }
      });
  }
}

export default SendForgottenPasswordEmailService;
