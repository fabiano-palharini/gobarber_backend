import AppError from '@shared/errors/AppError';
import FakeMailProvider  from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepositories from '../repositories/fakes/FakeUsersRepositories';
import SendForgottenPasswordEmailService from './SendForgottenPasswordEmailService';


describe('SendForgottenPasswordEmail', () => {
    it('should be able to recover password using the email', async () => {
        const fakeUsersRepositories = new FakeUsersRepositories();
        const fakeMailProvider  = new FakeMailProvider();

        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const sendForgottenPassword = new SendForgottenPasswordEmailService(fakeUsersRepositories, fakeMailProvider);

        await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password: '123456'});

        await sendForgottenPassword.execute({email: 'john@doe.com'});

        expect(sendMail).toHaveBeenCalled();
    });



})
