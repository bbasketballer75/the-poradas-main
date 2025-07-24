
import request from 'supertest';
import express from 'express';
import guestbookRoutes from './guestbookRoutes';

// Mock the controller functions
jest.mock('../controllers/guestbookController.js', () => ({
  getGuestbookEntries: jest.fn(),
  createGuestbookEntry: jest.fn(),
  validateGuestbookEntry: jest.fn((req, res, next) => next()), // Mock middleware
}));

import { getGuestbookEntries, createGuestbookEntry } from '../controllers/guestbookController.js';

const app = express();
app.use(express.json());
app.use('/guestbook', guestbookRoutes);

describe('Guestbook Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /guestbook', () => {
    it('should fetch guestbook entries successfully', async () => {
      getGuestbookEntries.mockImplementation((req, res) => 
        res.status(200).json([{ message: 'Test Entry', name: 'Test User' }])
      );

      const res = await request(app).get('/guestbook');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([{ message: 'Test Entry', name: 'Test User' }]);
    });

    it('should handle server errors', async () => {
      getGuestbookEntries.mockImplementation((req, res) => 
        res.status(500).json({ message: 'Server error' })
      );

      const res = await request(app).get('/guestbook');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /guestbook', () => {
    it('should create a new guestbook entry', async () => {
      const newEntry = { name: 'John Doe', message: 'Great wedding!' };
      createGuestbookEntry.mockImplementation((req, res) => 
        res.status(201).json({ ...newEntry, timestamp: new Date() })
      );

      const res = await request(app)
        .post('/guestbook')
        .send(newEntry);

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual('John Doe');
      expect(res.body.message).toEqual('Great wedding!');
    });

    it('should handle missing message', async () => {
      createGuestbookEntry.mockImplementation((req, res) => 
        res.status(400).json({ message: 'A message is required to sign the guestbook.' })
      );

      const res = await request(app)
        .post('/guestbook')
        .send({ name: 'John Doe' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('message is required');
    });

    it('should handle empty message', async () => {
      createGuestbookEntry.mockImplementation((req, res) => 
        res.status(400).json({ message: 'A message is required to sign the guestbook.' })
      );

      const res = await request(app)
        .post('/guestbook')
        .send({ name: 'John Doe', message: '   ' });

      expect(res.statusCode).toEqual(400);
    });

    it('should handle server errors during creation', async () => {
      createGuestbookEntry.mockImplementation((req, res) => 
        res.status(500).json({ message: 'Database error' })
      );

      const res = await request(app)
        .post('/guestbook')
        .send({ name: 'John Doe', message: 'Great wedding!' });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toEqual('Database error');
    });
  });
});
