export const production: { url: string; timeout: number } = {
  url: '/api',
  timeout: 300000
};

export const development: { url: string; timeout: number } = {
  url: 'http://localhost:3000/api',
  timeout: 300000
};
