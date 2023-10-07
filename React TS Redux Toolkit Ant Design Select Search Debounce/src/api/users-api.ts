import { User } from '../models/user';
import { axiosClient } from './axios-client';

// https://random-data-api.com/api/v2/users?size=2
interface GetUserListParams {
  size?: number;
}

export const usersApi = {
  getUserList: ({ size }: GetUserListParams): Promise<User> => {
    return axiosClient.get('/users', {
      params: {
        size: size,
      },
    });
  },
};
