# Use lightweight Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the TypeScript files into /dist
RUN npm run build

# Expose port
EXPOSE 8080

# Run the compiled app
CMD ["node", "dist/index.js"]
