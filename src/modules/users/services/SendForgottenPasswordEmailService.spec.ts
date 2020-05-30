import AppError from '@shared/errors/AppError';
import FakeMailProvider  from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepositories from '../repositories/fakes/FakeUsersRepositories';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgottenPasswordEmailService from './SendForgottenPasswordEmailService';

let fakeUsersRepositories: FakeUsersRepositories;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgottenPassword: SendForgottenPasswordEmailService;


describe('SendForgottenPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepositories = new FakeUsersRepositories();
        fakeMailProvider  = new FakeMailProvider();
        fakeUserTokensRepository  = new FakeUserTokensRepository();

        sendForgottenPassword = new SendForgottenPasswordEmailService(fakeUsersRepositories, fakeMailProvider, fakeUserTokensRepository);
    });


    it('should be able to recover password using the email', async () => {


        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
        await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password: '123456'});

        await sendForgottenPassword.execute({email: 'john@doe.com'});

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not allow a non-user to recover the password', async() => {

        await expect(sendForgottenPassword.execute({email: 'john@doe.com'})).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgotten password',async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password: '123456'});

        await sendForgottenPassword.execute({email: 'john@doe.com'});

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });


})
