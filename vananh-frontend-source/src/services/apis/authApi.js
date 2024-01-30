import authAxios from './auth.interceptor';

export const UserLogin = (username, password) => {
  return authAxios.post('/login', {
    username: username,
    password: password
  });
};
