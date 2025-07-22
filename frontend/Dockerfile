# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the build output from the React app to the Nginx public directory
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
