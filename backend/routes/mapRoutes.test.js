

// Mock the controller functions
jest.mock('../controllers/mapController.js', () => ({
  getLocations: jest.fn(),
  logVisit: jest.fn(),
}));

import request from 'supertest';
import express from 'express';
import mapRoutes from './mapRoutes';
import { getLocations, logVisit } from '../controllers/mapController.js';

const app = express();
app.use(express.json());
app.use('/', mapRoutes);

describe('Map Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /locations', () => {
    it('should fetch visitor locations successfully', async () => {
      const mockLocations = [
        { city: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
        { city: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 }
      ];
      getLocations.mockImplementation((req, res) => 
        res.status(200).json(mockLocations)
      );

      const res = await request(app).get('/locations');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockLocations);
    });

    it('should handle empty locations', async () => {
      getLocations.mockImplementation((req, res) => 
        res.status(200).json([])
      );

      const res = await request(app).get('/locations');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should handle server errors', async () => {
      getLocations.mockImplementation((req, res) => 
        res.status(500).json({ message: 'Database error' })
      );

      const res = await request(app).get('/locations');
      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Database error');
    });
  });

  describe('POST /log-visit', () => {
    it('should log a new visit successfully', async () => {
      const mockVisit = {
        ip_address: '192.168.1.1',
        city: 'New York',
        country: 'US',
        latitude: 40.7128,
        longitude: -74.0060,
        timestamp: new Date()
      };
      logVisit.mockImplementation((req, res) => 
        res.status(201).json(mockVisit)
      );

      const res = await request(app)
        .post('/log-visit')
        .set('x-forwarded-for', '192.168.1.1');

      expect(res.statusCode).toEqual(201);
      expect(res.body.ip_address).toEqual('192.168.1.1');
    });

    it('should handle recent visit (rate limiting)', async () => {
      logVisit.mockImplementation((req, res) => 
        res.status(200).json({ message: 'Visit already logged recently.' })
      );

      const res = await request(app)
        .post('/log-visit')
        .set('x-forwarded-for', '192.168.1.1');

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('already logged');
    });

    it('should handle geolocation failure', async () => {
      logVisit.mockImplementation((req, res) => 
        res.status(500).json({ message: 'Could not determine location.' })
      );

      const res = await request(app)
        .post('/log-visit')
        .set('x-forwarded-for', '192.168.1.1');

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Could not determine location.');
    });

    it('should handle localhost IP addresses', async () => {
      const mockVisit = {
        ip_address: '127.0.0.1',
        city: 'Test City',
        country: 'Test Country',
        latitude: 24.48,
        longitude: -81.8,
        timestamp: new Date()
      };
      logVisit.mockImplementation((req, res) => 
        res.status(201).json(mockVisit)
      );

      const res = await request(app)
        .post('/log-visit')
        .set('x-forwarded-for', '127.0.0.1');

      expect(res.statusCode).toEqual(201);
    });

    it('should handle missing IP header', async () => {
      const mockVisit = {
        ip_address: '::1',
        city: 'Test City',
        country: 'Test Country',
        latitude: 24.48,
        longitude: -81.8,
        timestamp: new Date()
      };
      logVisit.mockImplementation((req, res) => 
        res.status(201).json(mockVisit)
      );

      const res = await request(app).post('/log-visit');
      expect(res.statusCode).toEqual(201);
    });
  });
});
