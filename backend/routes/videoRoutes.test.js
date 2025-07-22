
import request from 'supertest';
import express from 'express';
import videoRoutes from './videoRoutes';

// Mock the controller functions
jest.mock('../controllers/videoController.js', () => ({
  streamVideo: (req, res) => res.status(200).send('video stream'),
}));

const app = express();
app.use(express.json());
app.use('/', videoRoutes);

describe('Video Routes', () => {
  it('should stream a video', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('video stream');
  });
});
