import { db } from './prismaClient';

export function addUser(email: string, username: string, password: string) {
  if (email === undefined || username === undefined || password === undefined) {
    return Promise.reject({ status: 400, message: 'Bad Request' });
  }
  const user = db.user.create({ data: { email, username, password } });
  return user;
}
