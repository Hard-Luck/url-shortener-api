import request from 'supertest';
import app from '..';
import { isApiUrl } from '../models/utils/typeguards';
import { seed } from '../db/seed';

const api = request(app);
let token = '';
beforeAll(async () => {
  const email = 'mark@test.com';
  const password = 'password';
  const {
    body: { token: newToken },
  } = await api.post('/v1/login').send({ email, password });
  token = newToken;
});
beforeEach(async () => await seed());

describe('API', () => {
  describe('REDIRECT', () => {
    describe('GET /:url_id', () => {
      it('Status 302: Redirects to original url', async () => {
        const res = await api.get('/1').expect(302);
        expect(res.header.location).toBe('https://www.google.com');
      });
      it('increases the clicked counter when successful', async () => {
        await api.get('/1');
        const {
          body: { urls },
        } = await api.get('/v1/urls').set('Authorization', `Bearer ${token}`);
        const url = urls.find(
          (url: { id: string; clicked: number }) => url.id === '1',
        );
        expect(url).toHaveProperty('clicked', 1);
        await api.get('/1');
        const {
          body: { urls: secondCheck },
        } = await api.get('/v1/urls').set('Authorization', `Bearer ${token}`);
        const urlClickedTwice = secondCheck.find(
          (url: { id: string; clicked: number }) => url.id === '1',
        );
        expect(urlClickedTwice).toHaveProperty('clicked', 2);
      });
      it('Status 404: if url_id is not found', async () => {
        await api.get('/3000').expect(404);
      });
    });
  });
  describe('URLS', () => {
    describe('GET /v1/urls', () => {
      it('Status 200: Serves all urls', async () => {
        const {
          body: { urls },
        } = await api
          .get('/v1/urls')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
        expect(urls).toHaveLength(3);
        urls.forEach((url: unknown) => {
          expect(isApiUrl(url)).toBe(true);
        });
      });
    });
    describe('POST /v1/urls', () => {
      it('Status 201: Serves new url', async () => {
        const originalUrl = 'https://www.google.com';
        const alias = 'google';
        const {
          body: { url },
        } = await api
          .post('/v1/urls')
          .set('Authorization', `Bearer ${token}`)
          .send({ url: originalUrl, alias })
          .expect(201);
        if (!isApiUrl(url)) {
          throw new Error('url is not an api url');
        } else {
          expect(url.userId).toBe('2');
          expect(url.originalUrl).toBe(originalUrl);
          expect(url).toHaveProperty('id', expect.any(String));
          expect(url).toHaveProperty('isActive', true);
        }
        const {
          body: { urls },
        } = await api
          .get('/v1/urls')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
        expect(urls).toHaveLength(4);
      });
      it('Status 400: if url is missing', async () => {
        const {
          body: { message },
        } = await api
          .post('/v1/urls')
          .set('Authorization', `Bearer ${token}`)
          .send({ alias: 'google' })
          .expect(400);
        expect(message).toBe('Invalid url');
      });
    });
    describe('GET /v1/urls/user', () => {
      it('200: should serve users urls', async () => {
        const {
          body: { urls },
        } = await api
          .get('/v1/urls/user')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
        expect(urls).toHaveLength(2);
        urls.forEach((url: unknown) => {
          if (isApiUrl(url)) expect(url.userId).toBe('2');
          else throw new Error('url is not an api url');
        });
      });
    });
    describe('PATCH /v1/urls/:id', () => {
      it('200: should serve url with changed isActive', async () => {
        const requestBody = {
          isActive: false,
        };
        const {
          body: { url },
        } = await api
          .patch('/v1/urls/2')
          .send(requestBody)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
        if (isApiUrl(url)) expect(url.isActive).toBe(false);
        else throw new Error('url is not an api url');
      });
      it('200: should serve url with changed alias', async () => {
        const requestBody = {
          alias: 'new alias',
        };
        const {
          body: { url },
        } = await api
          .patch('/v1/urls/2')
          .send(requestBody)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
        if (isApiUrl(url)) expect(url.alias).toBe('new alias');
        else throw new Error('url is not an api url');
      });
      it('400: if keys is missing', async () => {
        const {
          body: { message },
        } = await api
          .patch('/v1/urls/2')
          .send({})
          .set('Authorization', `Bearer ${token}`)
          .expect(400);
        expect(message).toBe('Bad Request');
      });
      it('403 : if not token is provided', () => {
        return api.patch('/v1/urls/2').send({}).expect(403);
      });
      it('404: if url_id is not found', async () => {
        const requestBody = {
          isActive: false,
        };
        await api
          .patch('/v1/urls/3000')
          .send(requestBody)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
      it('404: if user is not the owner of the url', async () => {
        const requestBody = {
          isActive: false,
        };
        await api
          .patch('/v1/urls/1')
          .send(requestBody)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
    });
    describe('DELETE /v1/urls/:id', () => {
      it('204 : should delete url and return no content', async () => {
        const allUrls = await api
          .get('/v1/urls')
          .set('Authorization', `Bearer ${token}`);
        expect(allUrls.body.urls).toHaveLength(3);
        await api
          .delete('/v1/urls/2')
          .set('Authorization', `Bearer ${token}`)
          .expect(204);
        const allUrlsAfterDelete = await api
          .get('/v1/urls')
          .set('Authorization', `Bearer ${token}`);
        expect(allUrlsAfterDelete.body.urls).toHaveLength(2);
      });
      it('403 : if not token is provided', () => {
        return api.delete('/v1/urls/1').expect(403);
      });
      it('404 : if url_id is not found', async () => {
        await api
          .delete('/v1/urls/3000')
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
      it('404 : if user is not the owner of the url', async () => {
        await api
          .delete('/v1/urls/1')
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
    });
  });
  describe('USERS', () => {
    describe('POST /v1/users', () => {
      it('201 : should create user', async () => {
        const newUser = {
          email: 'XXXX@XXXXXX.XXX',
          username: 'XXXX',
          password: 'password',
        };
        const { body } = await api.post('/v1/users').send(newUser).expect(201);
        expect(body.user.email).toBe(newUser.email);
        expect(body.user).toHaveProperty('id', expect.any(String));
        expect(body.user).toHaveProperty('password', expect.any(String));
      });
      it('400 : if email is missing', async () => {
        const newUser = { password: 'XXXXXXXX' };
        const {
          body: { message },
        } = await api.post('/v1/users').send(newUser).expect(400);
        expect(message).toBe('Bad Request');
      });
      it('400 : if password is missing', async () => {
        const newUser = { email: 'XXXXXXXXXXXXXXX' };
        const {
          body: { message },
        } = await api.post('/v1/users').send(newUser).expect(400);
        expect(message).toBe('Bad Request');
      });
      it('400 : if username is missing', async () => {
        const newUser = {
          email: 'XXXXXXXXXXXXXXX',
          password: 'XXXXXXXXXXXXXXX',
        };
        const {
          body: { message },
        } = await api.post('/v1/users').send(newUser).expect(400);
        expect(message).toBe('Bad Request');
      });
    });
  });
});
