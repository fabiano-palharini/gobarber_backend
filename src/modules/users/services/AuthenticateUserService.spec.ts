import AppError from '@shared/errors/AppError';
import FakeUsersRepositories  from '../repositories/fakes/FakeUsersRepositories';
import FakeHashProvider  from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import FakeCacheProvider  from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepositories: FakeUsersRepositories;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;
let fakeCacheProvider: FakeCacheProvider;


describe('AuthenticateUser', () => {

    beforeEach(() => {
      fakeUsersRepositories  = new FakeUsersRepositories();
      fakeHashProvider  = new FakeHashProvider();
      fakeCacheProvider = new FakeCacheProvider();


      authenticateUserService = new AuthenticateUserService(fakeUsersRepositories,fakeHashProvider);
    });

    it('should be able to authenticate', async () => {
      const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});

      const response = await authenticateUserService.execute({email: 'johndoe@email.com', password: '123456'});

      expect(response).toHaveProperty('token');
      expect(response.user).toEqual(user);
    });


    it('should not be able to authenticate with non existing user', async () => {
      await expect(authenticateUserService.execute({email: 'johndoe@email.com', password: '123456'})).rejects.toBeInstanceOf(AppError);
    });


    it('should not be able to authenticate with wrong password', async () => {
      await fakeUsersRepositories.create({name: 'John Doe', email: 'johndoe@email.com', password: '123456'});


      await expect(authenticateUserService.execute({email: 'johndoe@email.com', password: 'wrong_password'})).rejects.toBeInstanceOf(AppError);
    });

})
