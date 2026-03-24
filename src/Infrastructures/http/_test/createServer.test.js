import request from 'supertest';
import pool from '../../database/postgres/pool.js';
import createServer from '../createServer.js';

describe('HTTP server - createServer', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should response 404 when request unregistered route', async () => {
    const app = await createServer({});

    const response = await request(app).get('/unregisteredRoute');

    expect(response.status).toEqual(404);
  });

  it('should handle server error correctly', async () => {
    const requestPayload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'super_secret',
    };
    const app = await createServer({});

    const response = await request(app).post('/users').send(requestPayload);

    expect(response.status).toEqual(500);
    expect(response.body.status).toEqual('error');
    expect(response.body.message).toEqual('terjadi kegagalan pada server kami');
  });
});
