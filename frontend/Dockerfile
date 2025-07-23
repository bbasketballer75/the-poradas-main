FROM node:20-slim AS builder

WORKDIR /app

COPY package.json ./
COPY . .

RUN npm install

# Build the React app, ensuring VITE_API_BASE_URL is used
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the React app to the Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]