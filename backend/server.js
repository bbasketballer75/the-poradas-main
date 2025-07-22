import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import connectDB from './config/db.js';

// Manually configure dotenv to look for the .env file in the project root,
// which is one level up from the 'backend' directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use. Please check if another instance is running.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));