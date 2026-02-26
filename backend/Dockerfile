# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create directories for static files
RUN mkdir -p static/assets static/email/test-emails static/email/templates/partials static/email/templates/body

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Production command
CMD ["npm", "start"]
