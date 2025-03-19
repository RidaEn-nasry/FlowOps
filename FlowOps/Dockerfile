FROM node:18-alpine

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./

# Install all dependencies
RUN npm install
# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

COPY . .

# Generate Prisma clients
RUN npm run prisma:generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 