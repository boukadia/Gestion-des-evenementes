FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NODE_ENV=production

# Build the app
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]