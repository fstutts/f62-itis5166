# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install dependencies in server directory
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/ ./server/

# Expose port
EXPOSE 3000

# Start the application
WORKDIR /app/server
CMD ["node", "index.js"]
