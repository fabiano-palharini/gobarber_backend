import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepositories  from '../repositories/fakes/FakeUsersRepositories';
import UpdateProfileService from './UpdateProfileService';


let fakeHashProvider: FakeHashProvider;
let fakeUsersRepositories: FakeUsersRepositories;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(()=> {
      fakeHashProvider  = new FakeHashProvider();
      fakeUsersRepositories  = new FakeUsersRepositories();
      updateProfileService = new UpdateProfileService(fakeUsersRepositories,fakeHashProvider);
    })

    it('should be able to update the profile', async () => {
      const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});

      const updatedUser = await updateProfileService.execute({user_id: user.id, name: 'John John', email: 'john@john.com'});

      expect(updatedUser.name).toBe('John John');
      expect(updatedUser.email).toBe('john@john.com');
    });



    it('should not be able to change to another user email', async () => {
      await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});
      const user = await fakeUsersRepositories.create({name: 'Another Guy', email: 'another@guy.com', password:'123456'});

      await expect(updateProfileService.execute({user_id: user.id, name: 'Another Guy', email: 'john@doe.com'})).rejects.toBeInstanceOf(AppError);
    });


    it('should be able to update the password', async () => {
      const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});

      const updatedUser = await updateProfileService.execute({user_id: user.id, name: 'John John', email: 'john@john.com', old_password: '123456', password: '123123'});

      expect(updatedUser.password).toBe('123123');
    });


    it('should not be able to update the password without the old password', async () => {
      const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});


      await expect(updateProfileService.execute({user_id: user.id,
                                                 name: 'John John',
                                                 email: 'john@john.com',
                                                 password: '123123'})).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong old password', async () => {
      const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});


      await expect(updateProfileService.execute({user_id: user.id,
                                                 name: 'John Doe',
                                                 email: 'john@doe.com',
                                                 old_password: 'wrong-old-password',
                                                 password: '123123'})).rejects.toBeInstanceOf(AppError);
    });

})
