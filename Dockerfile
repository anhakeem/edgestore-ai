# Use official Node.js 18 image
FROM node:18

# Set working directory to API service
WORKDIR /usr/src/app

# Copy only the API service's package files
COPY apps/api/package*.json ./

# Install dependencies
RUN npm install

# Copy source code into container
COPY apps/api .

# Expose port
EXPOSE 8080

# Start API using ts-node
CMD ["npx", "ts-node", "index.ts"]
