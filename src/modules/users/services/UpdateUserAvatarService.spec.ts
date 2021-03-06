import AppError from '@shared/errors/AppError';

import FakeUsersRepositories  from '../repositories/fakes/FakeUsersRepositories';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';


let fakeUsersRepositories: FakeUsersRepositories;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(()=> {
      fakeUsersRepositories  = new FakeUsersRepositories();
      fakeStorageProvider  = new FakeStorageProvider();
      updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepositories,fakeStorageProvider);
    })

    it('should be able to save an avatar image for a user', async () => {
    const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});

      await updateUserAvatar.execute({user_id: user.id, avatarFileName: 'avatar.jpg'});

      expect(user.avatar).toBe('avatar.jpg');
    });


    it('should not be able to save an avatar image for a non-existing user', async () => {
      await expect(updateUserAvatar.execute({user_id: 'no_id', avatarFileName: 'avatar.jpg'})).rejects.toBeInstanceOf(AppError);
    });


    it('should be delete an avatar image when inserting a new image', async () => {
      const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile'); //it returns the function you are spying on

      const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepositories,fakeStorageProvider);

      const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});

      await updateUserAvatar.execute({user_id: user.id, avatarFileName: 'avatar.jpg'});

      await updateUserAvatar.execute({user_id: user.id, avatarFileName: 'avatar2.jpg'});

      expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

      expect(user.avatar).toBe('avatar2.jpg');
    });
})
