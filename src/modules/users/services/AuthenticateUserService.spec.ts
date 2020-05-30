import AppError from '@shared/errors/AppError';
import FakeUsersRepositories  from '../repositories/fakes/FakeUsersRepositories';
import FakeHashProvider  from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
      const fakeUsersRepositories  = new FakeUsersRepositories();
      const fakeHashProvider  = new FakeHashProvider();

      const createUserService = new CreateUserService(fakeUsersRepositories, fakeHashProvider);
      const authenticateUserService = new AuthenticateUserService(fakeUsersRepositories,fakeHashProvider);

      const user = await createUserService.execute({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});

      const response = await authenticateUserService.execute({email: 'johndoe@email.com', password: '123456'});

      expect(response).toHaveProperty('token');
      expect(response.user).toEqual(user);
    });


    it('should not be able to authenticate with non existing', async () => {
      const fakeUsersRepositories  = new FakeUsersRepositories();
      const fakeHashProvider  = new FakeHashProvider();

      const authenticateUserService = new AuthenticateUserService(fakeUsersRepositories,fakeHashProvider);


      expect(authenticateUserService.execute({email: 'johndoe@email.com', password: '123456'})).rejects.toBeInstanceOf(AppError);
    });


    it('should not be able to authenticate with wrong password', async () => {
      const fakeUsersRepositories  = new FakeUsersRepositories();
      const fakeHashProvider  = new FakeHashProvider();

      const createUserService = new CreateUserService(fakeUsersRepositories, fakeHashProvider);
      const authenticateUserService = new AuthenticateUserService(fakeUsersRepositories,fakeHashProvider);

      await createUserService.execute({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});


      await expect(authenticateUserService.execute({email: 'johndoe@email.com', password: 'wrong_password'})).rejects.toBeInstanceOf(AppError);
    });

})
