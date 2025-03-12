FROM node:20-slim AS base

WORKDIR /app

COPY package*.json ./

# dev 
FROM base AS development
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# build stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# prod
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 