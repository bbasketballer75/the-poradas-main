
import request from 'supertest';
import express from 'express';
import mapRoutes from './mapRoutes';

// Mock the controller functions
jest.mock('../controllers/mapController.js', () => ({
  getLocations: (req, res) => res.status(200).json([{ location: 'Test Location' }]),
  logVisit: (req, res) => res.status(201).json({ message: 'Visit logged' }),
}));

const app = express();
app.use(express.json());
app.use('/', mapRoutes);

describe('Map Routes', () => {
  it('should fetch locations', async () => {
    const res = await request(app).get('/locations');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ location: 'Test Location' }]);
  });
});
