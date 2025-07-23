import { getGuestbookEntries, createGuestbookEntry } from './guestbookController.js';
import GuestbookEntry from '../models/GuestbookEntry.js';

// Mock the GuestbookEntry model
jest.mock('../models/GuestbookEntry.js');

describe('Guestbook Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getGuestbookEntries', () => {
    it('should fetch all guestbook entries successfully', async () => {
      const mockEntries = [
        { name: 'John Doe', message: 'Great wedding!', timestamp: new Date() },
        { name: 'Jane Smith', message: 'Beautiful ceremony', timestamp: new Date() }
      ];

      const mockSort = jest.fn().mockResolvedValue(mockEntries);
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      GuestbookEntry.find = mockFind;

      await getGuestbookEntries(mockReq, mockRes);

      expect(mockFind).toHaveBeenCalledWith({});
      expect(mockSort).toHaveBeenCalledWith({ timestamp: -1 });
      expect(mockRes.json).toHaveBeenCalledWith(mockEntries);
    });

    it('should handle database errors', async () => {
      const mockSort = jest.fn().mockRejectedValue(new Error('Database error'));
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      GuestbookEntry.find = mockFind;

      // Wrap in try/catch to avoid unhandled rejection
      try {
        await getGuestbookEntries(mockReq, mockRes);
      } catch (e) {
        // expected
      }

      await expect(getGuestbookEntries(mockReq, mockRes)).rejects.toThrow('Database error');
    });
  });

  describe('createGuestbookEntry', () => {
    it('should create a new guestbook entry successfully', async () => {
      const entryData = { name: 'John Doe', message: 'Great wedding!' };
      const mockEntry = { 
        ...entryData, 
        _id: '507f1f77bcf86cd799439011',
        timestamp: new Date() 
      };

      mockReq.body = entryData;
      GuestbookEntry.create = jest.fn().mockResolvedValue(mockEntry);

      await createGuestbookEntry(mockReq, mockRes);

      expect(GuestbookEntry.create).toHaveBeenCalledWith(entryData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEntry);
    });

    it('should create entry with anonymous name when name is missing', async () => {
      const entryData = { message: 'Great wedding!' };
      const expectedData = { name: 'Anonymous', message: 'Great wedding!' };
      const mockEntry = { 
        ...expectedData, 
        _id: '507f1f77bcf86cd799439011',
        timestamp: new Date() 
      };

      mockReq.body = entryData;
      GuestbookEntry.create = jest.fn().mockResolvedValue(mockEntry);

      await createGuestbookEntry(mockReq, mockRes);

      expect(GuestbookEntry.create).toHaveBeenCalledWith(expectedData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEntry);
    });

    it('should reject empty message', async () => {
      mockReq.body = { name: 'John Doe', message: '' };

      // Mock the error throwing by setting up next function
      const mockNext = jest.fn();
      
      try {
        await createGuestbookEntry(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error.message).toEqual('A message is required to sign the guestbook.');
      }

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should reject whitespace-only message', async () => {
      mockReq.body = { name: 'John Doe', message: '   ' };

      const mockNext = jest.fn();
      
      try {
        await createGuestbookEntry(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error.message).toEqual('A message is required to sign the guestbook.');
      }

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should handle database creation errors', async () => {
      mockReq.body = { name: 'John Doe', message: 'Great wedding!' };
      GuestbookEntry.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const mockNext = jest.fn();
      
      try {
        await createGuestbookEntry(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error.message).toEqual('Database error');
      }

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle validation errors', async () => {
      mockReq.body = { name: 'John Doe', message: 'x'.repeat(501) }; // Exceeds maxlength
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      
      GuestbookEntry.create = jest.fn().mockRejectedValue(validationError);

      const mockNext = jest.fn();
      
      try {
        await createGuestbookEntry(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error.name).toEqual('ValidationError');
      }

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
