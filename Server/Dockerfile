FROM node:22-alpine

WORKDIR /app

# Copy package info and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Set environment to production
ENV NODE_ENV production
ENV PORT 5001

# Expose backend port
EXPOSE 5001

# Start server
CMD ["node", "index.js"]
