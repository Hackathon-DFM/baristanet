# 1. Use a base image with Node
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 4. Copy package files and install deps
COPY package.json ./
RUN pnpm install

# 5. Copy the rest of the app
COPY . .

# 6. Expose port (optional)
EXPOSE 42069

# 7. Start app
CMD ["pnpm", "codegen"]
CMD ["pnpm", "start"]

