import AppError from '@shared/errors/AppError';

import FakeUsersRepositories  from '../repositories/fakes/FakeUsersRepositories';
import ShowProfileService from './ShowProfileService';


let fakeUsersRepositories: FakeUsersRepositories;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(()=> {
      fakeUsersRepositories  = new FakeUsersRepositories();
      showProfileService = new ShowProfileService(fakeUsersRepositories);
    })

    it('should be able to show the profile', async () => {
      const user = await fakeUsersRepositories.create({name: 'John Doe', email: 'john@doe.com', password:'123456'});

      const profile = await showProfileService.execute({user_id: user.id});

      expect(profile.name).toBe('John Doe');
      expect(profile.email).toBe('john@doe.com');
    });

    it('should not be able to show the profile of a non-existing user', async () => {
      await expect(showProfileService.execute({user_id: 'non-existing user_id'})).rejects.toBeInstanceOf(AppError);
    });


})
