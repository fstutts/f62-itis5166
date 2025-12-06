# Use Node.js official image
FROM node:18-alpine

# Set working directory to server
WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Expose port (Railway will set this automatically)
EXPOSE 3000

# Start the application directly with node
CMD ["node", "index.js"]
