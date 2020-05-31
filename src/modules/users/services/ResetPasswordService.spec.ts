import AppError from '@shared/errors/AppError';
import FakeMailProvider  from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepositories from '../repositories/fakes/FakeUsersRepositories';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepositories: FakeUsersRepositories;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;


describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepositories = new FakeUsersRepositories();
        fakeMailProvider  = new FakeMailProvider();
        fakeUserTokensRepository  = new FakeUserTokensRepository();

        resetPasswordService = new ResetPasswordService(fakeUsersRepositories,  fakeUserTokensRepository);
    });


    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password: '123456'});

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({token, password: '123123' });

        const updatedUser = await fakeUsersRepositories.findById(user.id);

        expect(updatedUser?.password).toBe('123123');
    });



})