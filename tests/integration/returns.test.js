const request = require('supertest');

const { objectId } = require('../utils');
const Rental = require('../../models/rental').Rental;

server = require('../../index');

describe('/api/returns', () => {
  let server;
  let rental;
  let customerId;
  let movieId;
  let token;

  beforeEach(async () => {
    customerId = objectId();
    movieId = objectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });

  afterEach(async () => {
    await Rental.remove({});
  });

  afterAll(async () => {
    await server.close();
  });

  //
  it('should return 401 if client is not login', async () => {
    const res = await request(server).get('/api/movies');

    expect(res.status).toBe(401);
  });
});
