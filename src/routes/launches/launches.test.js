const request = require('supertest');

const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');


describe('Launches API', ()=> {
  beforeAll(async ()=>{
    await mongoConnect()
  })

  afterAll(async ()=> {
    await mongoDisconnect()
  })

  describe('Test /GET launches', ()=> {

    test('should return 200 response status code', async() => {
      const response = await request(app)
      .get('/v1/launches')
      .expect('Content-Type', /json/)
      .expect(200)
    })
  })
  
  describe('Test /POST launch', () => {
  
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028'
    }
  
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    }
  
    const launchDataWithInvalidData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'not a date'
    }
  
    test('It should return 201 response status code', async() => {
      const response = await request(app)
      .post('/v1/launches')
      .send(completeLaunchData)
      .expect('Content-Type', /json/)
      .expect(201)
  
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
  
      expect(responseDate).toBe(requestDate);
  
      expect(response.body).toMatchObject(launchDataWithoutDate);
  
  
  
    })
  
    test('It should return 400 Valid date required for launch date', async () => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchDataWithoutDate)
      .expect('Content-Type', /json/)
      .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'Missing launch information'
      })
  
    })
  
    test('It should return 400 Missing launch information', async () => {
      const response = await request(app)
      .post('/v1/launches')
      .send(launchDataWithInvalidData)
      .expect('Content-Type', /json/)
      .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'Valid date required for launch date'
      })
  
    })
  })

})


