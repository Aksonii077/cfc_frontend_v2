# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables (baked into static build)
ARG VITE_API_BASE_URL
ARG VITE_MENTOR_API_BASE_URL
ARG VITE_AGENT_URL
ARG VITE_AGENT_API_TIMEOUT
ARG VITE_MAIN_WEBSITE_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GOOGLE_ANALYTICS_ID
ARG VITE_ACCESS_TOKEN

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_MENTOR_API_BASE_URL=$VITE_MENTOR_API_BASE_URL
ENV VITE_AGENT_URL=$VITE_AGENT_URL
ENV VITE_AGENT_API_TIMEOUT=$VITE_AGENT_API_TIMEOUT
ENV VITE_MAIN_WEBSITE_URL=$VITE_MAIN_WEBSITE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GOOGLE_ANALYTICS_ID=$VITE_GOOGLE_ANALYTICS_ID
ENV VITE_ACCESS_TOKEN=$VITE_ACCESS_TOKEN

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built files from build stage (vite outputs to 'build' directory)
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create health check endpoint
RUN echo '{"status":"ok","service":"cofounder-circle-frontend"}' > /usr/share/nginx/html/health

# Add non-root user for security
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

