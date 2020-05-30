import AppError from '@shared/errors/AppError';
import FakeUsersRepositories  from '../repositories/fakes/FakeUsersRepositories';
import CreateUserService from './CreateUserService';
import FakeHashProvider  from '../providers/HashProvider/fakes/FakeHashProvider';


describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
      const fakeUsersRepositories  = new FakeUsersRepositories();
      const fakeHashProvider  = new FakeHashProvider();

      const createUserService = new CreateUserService(fakeUsersRepositories,fakeHashProvider);

      const user = await createUserService.execute({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('johndoe@email.com');
    });


    it('should not be able to create a new user with same email', async () => {
      const fakeUsersRepositories  = new FakeUsersRepositories();
      const fakeHashProvider  = new FakeHashProvider();

      const createUserService = new CreateUserService(fakeUsersRepositories, fakeHashProvider);

      await createUserService.execute({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});

      await expect(createUserService.execute({name: 'John Doe2', email: 'johndoe@email.com', password: '123456'})).rejects.toBeInstanceOf(AppError);
    });

})
