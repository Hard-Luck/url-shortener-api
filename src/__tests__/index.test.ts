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
        const { body: { urls } } = await api.get("/v1/urls/user")
          .set('Authorization', `Bearer ${token}`)
          .expect(200);
        expect(urls).toHaveLength(2);
        urls.forEach((url: unknown) => {
          if (isApiUrl(url)) expect(url.userId).toBe('2');
          else throw new Error('url is not an api url');
        });
      })
    })
  })
})
