
import request from 'supertest';
import express from 'express';
import guestbookRoutes from './guestbookRoutes';

// Mock the controller functions
jest.mock('../controllers/guestbookController.js', () => ({
  getGuestbookEntries: (req, res) => res.status(200).json([{ message: 'Test Entry' }]),
  createGuestbookEntry: (req, res) => res.status(201).json({ message: 'Entry created' }),
}));

const app = express();
app.use(express.json());
app.use('/guestbook', guestbookRoutes);

describe('Guestbook Routes', () => {
  it('should fetch guestbook entries', async () => {
    const res = await request(app).get('/guestbook');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ message: 'Test Entry' }]);
  });
});
