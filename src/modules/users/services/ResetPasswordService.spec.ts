import AppError from '@shared/errors/AppError';
import FakeMailProvider  from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepositories from '../repositories/fakes/FakeUsersRepositories';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepositories: FakeUsersRepositories;
let fakeMailProvider: FakeMailProvider;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;


describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepositories = new FakeUsersRepositories();
        fakeMailProvider  = new FakeMailProvider();
        fakeHashProvider  = new FakeHashProvider();
        fakeUserTokensRepository  = new FakeUserTokensRepository();

        resetPasswordService = new ResetPasswordService(fakeUsersRepositories,  fakeUserTokensRepository, fakeHashProvider);
    });


    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password: '123456'});

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({token, password: '123123' });

        const updatedUser = await fakeUsersRepositories.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });


    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
          resetPasswordService.execute({
            token: 'non-existing-token',
            password: '123456'
          }),
        ).rejects.toBeInstanceOf(AppError);
    });

  it('should not be able to reset the password with non-existing user', async () => {
      const { token } = await fakeUserTokensRepository.generate('non-existing-user');


      await expect(
        resetPasswordService.execute({
          token,
          password: '123456'
        }),
      ).rejects.toBeInstanceOf(AppError);
   });


    it('should not be able to reset the password after 2 hours past', async () => {
        const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password: '123456'});

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });


        await expect(
          resetPasswordService.execute({
            token,
            password: '123123'
          }),
        ).rejects.toBeInstanceOf(AppError);
    });
})
