import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './config/db.js';

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

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