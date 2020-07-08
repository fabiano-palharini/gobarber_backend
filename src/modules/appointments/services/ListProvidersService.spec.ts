import AppError from '@shared/errors/AppError';

import FakeUsersRepositories  from '@modules/users/repositories/fakes/FakeUsersRepositories';
import ListProvidersService from './ListProvidersService';
import FakeCacheProvider  from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';


let fakeUsersRepositories: FakeUsersRepositories;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
    beforeEach(()=> {
      fakeUsersRepositories  = new FakeUsersRepositories();
      fakeCacheProvider = new FakeCacheProvider();
      listProvidersService = new ListProvidersService(fakeUsersRepositories, fakeCacheProvider);
    })

    it('should be able to list the providers', async () => {
      const user1 = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});
      const user2 = await fakeUsersRepositories.create({name: 'John John', email: 'john@john.com', password:'123456'});
      const loggedUser = await fakeUsersRepositories.create({name: 'Little John', email: 'little@john.com', password:'123456'});

      const providers = await listProvidersService.execute({user_id: loggedUser.id});

      expect(providers).toEqual([user1, user2]);
    });


})
