FROM node:18-alpine

WORKDIR /app

# Copy package info and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Set environment to production
ENV NODE_ENV production

# Expose backend port
EXPOSE 8000

# Start server
CMD ["node", "index.js"]
