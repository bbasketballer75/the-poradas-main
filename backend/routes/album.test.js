
import request from 'supertest';
import express from 'express';
import albumRoutes from './album';

// Mock the controller functions
jest.mock('../controllers/albumController.js', () => ({
  getAlbumMedia: (req, res) => res.status(200).json([{ message: 'Test Media' }]),
  uploadMedia: (req, res) => res.status(201).json({ message: 'Media uploaded' }),
  getAllAlbumMedia: (req, res) => res.status(200).json([{ message: 'All Media' }]),
  moderateMedia: (req, res) => res.status(200).json({ message: 'Media moderated' }),
}));

// Mock the middleware
jest.mock('../middleware/uploadMiddleware.js', () => ({
  __esModule: true,
  default: {
    array: () => (req, res, next) => next(),
  },
}));
jest.mock('../middleware/authMiddleware.js', () => ({
  protectAdmin: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/', albumRoutes);

describe('Album Routes', () => {
  it('should fetch approved album media', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ message: 'Test Media' }]);
  });
});
