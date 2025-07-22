import VisitorLog from '../models/VisitorLog.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getGeoLocation } from '../utils/geo.js';

/**
 * @desc    Get all visitor locations
 * @route   GET /api/map/locations
 * @access  Public
 */
export const getLocations = asyncHandler(async (req, res) => {
  // Aggregate to get unique locations, which is more efficient for the map.
  const locations = await VisitorLog.aggregate([
    { $group: { _id: { city: '$city', country: '$country' }, lat: { $first: '$latitude' }, lon: { $first: '$longitude' } } },
    { $project: { _id: 0, city: '$_id.city', country: '$_id.country', lat: 1, lon: 1 } },
  ]);
  res.status(200).json(locations);
});

/**
 * @desc    Log a new visitor
 * @route   POST /api/map/log-visit
 * @access  Public
 */
export const logVisit = asyncHandler(async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.ip;

  // --- Robust Rate Limiting Logic ---
  // Check if a visit from this IP has been logged in the last 24 hours.
  // This is more reliable than an in-memory cache for cloud deployments.
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const recentVisit = await VisitorLog.findOne({
    ip_address: ip,
    timestamp: { $gte: new Date(Date.now() - oneDay) },
  });

  if (recentVisit) {
    return res.status(200).json({ message: 'Visit already logged recently.' });
  }

  const { lat, lon, city, country } = await getGeoLocation(ip);

  // Don't save entries where geolocation failed
  if (country === 'Error' || country === 'Unknown') {
    return res.status(500).json({ message: 'Could not determine location.' });
  }

  const newVisit = await VisitorLog.create({
    ip_address: ip,
    latitude: lat,
    longitude: lon,
    city,
    country,
  });

  res.status(201).json(newVisit);
});