const request = require('supertest');
const mongoose = require('mongoose');

const { Genre } = require('../../models/genre');
const { token } = require('../utils');

let server;

describe('/api/genres', () => {
  beforeEach(() => (server = require('../../index')));
  afterEach(async () => {
    await Genre.remove({});
    server.close();
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([{ name: 'action' }, { name: 'Thriller' }]);

      const res = await request(server).get('/api/genres');

      expect(res.body.some(genre => genre.name === 'action')).toBeTruthy();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /:id', () => {
    it('should return genre if valid id is passed', async () => {
      const payload = { name: 'genre1' };

      const genre = new Genre(payload);
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', payload.name);
    });

    it('should return 400 if id is not valid as objectId', async () => {
      const id = 123;
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(400);
    });

    it('should return 404 if there is no data', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    it('should shold return 401 if client is not auth', async () => {
      const res = await request(server)
        .post('/api/genres/')
        .send({ name: 'genre1' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('should should return 400 if name is less than 5 chars', async () => {
      const res = await request(server)
        .post('/api/genres/')
        .send('x-auth-token', token)
        .send({ name: 'aa' });

      expect(res.status).toBe(401);
    });
  });
});
