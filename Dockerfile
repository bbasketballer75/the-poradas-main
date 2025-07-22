# --- Stage 1: Build ---
# This Dockerfile is for the backend service.
# It assumes the build context is the project root.

# Use an official Node.js runtime as a parent image
FROM node:20-slim AS base

# Set the working directory in the container
WORKDIR /usr/src/app

# --- Stage 2: Dependencies ---
# Install dependencies first to leverage Docker layer caching
FROM base AS deps
WORKDIR /usr/src/app
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install --production

# --- Stage 3: Runner ---
# Copy source code and run the app
FROM base AS runner
WORKDIR /usr/src/app

# Copy installed dependencies from the 'deps' stage
COPY --from=deps /usr/src/app/backend/node_modules ./backend/node_modules

# Copy the backend application code
COPY backend/ ./backend/

# Copy the public assets and uploads directory that the backend needs to serve
COPY public/ ./public/
# The uploads directory might not exist initially, so handle that
COPY uploads/ ./uploads/

# Your app binds to port 5000, so we'll expose that.
# Cloud Run will automatically use the PORT environment variable it provides.
EXPOSE 5000

# Change to the backend directory to run the app
WORKDIR /usr/src/app/backend

# Define the command to run your app
CMD [ "npm", "start" ]