# ---- Stage 1: Build environment ----
    FROM node:18-alpine AS builder

    # Create app directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json (or yarn.lock) first
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy all other files
    COPY . .
    
    # Build the Next.js production bundles
    RUN npm run build
    
    # ---- Stage 2: Production environment ----
    FROM node:18-alpine AS runner
    
    WORKDIR /app
    
    # Copy package.json to runner
    COPY --from=builder /app/package*.json ./
    
    # Install ONLY production dependencies
    RUN npm install --production
    
    # Copy the production build from builder
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    # If you have any static files or other build artifacts that you need to serve,
    # make sure to copy them as well.
    
    # Expose the port (3000 is default for Next.js)
    EXPOSE 3000
    
    # Set the NODE_ENV to production
    ENV NODE_ENV=production
    
    # Start the Next.js server
    CMD ["npm", "run", "start"]
    

