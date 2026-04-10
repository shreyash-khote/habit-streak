# ---- Stage 1: Build the Expo web app ----
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy all frontend source files
COPY . .

# Build Tailwind CSS then export Expo as a static web app
RUN npx tailwindcss -i ./global.css -o ./assets/output.css && \
    npx expo export --platform web

# ---- Stage 2: Serve with nginx ----
FROM nginx:alpine

# Copy the built static files from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config to handle React Router-style navigation
COPY --from=builder /app/nginx.conf /etc/nginx/templates/default.conf.template

# Railway sets the PORT env variable; nginx will listen on it
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
