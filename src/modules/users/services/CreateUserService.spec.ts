import AppError from '@shared/errors/AppError';
import FakeUsersRepositories  from '../repositories/fakes/FakeUsersRepositories';
import CreateUserService from './CreateUserService';
import FakeHashProvider  from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider  from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';


let fakeUsersRepositories: FakeUsersRepositories;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {

    beforeEach(() => {
      fakeUsersRepositories  = new FakeUsersRepositories();
      fakeHashProvider  = new FakeHashProvider();
      fakeCacheProvider = new FakeCacheProvider();
      createUserService = new CreateUserService(fakeUsersRepositories,fakeHashProvider, fakeCacheProvider);
    });

    it('should be able to create a new user', async () => {
      const user = await createUserService.execute({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('johndoe@email.com');
    });


    it('should not be able to create a new user with same email', async () => {
      await createUserService.execute({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});

      await expect(createUserService.execute({name: 'John Doe2', email: 'johndoe@email.com', password: '123456'})).rejects.toBeInstanceOf(AppError);
    });

})
