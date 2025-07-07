#!/bin/bash

# Exit on any error
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building the application..."
npm run build

echo "Build completed successfully!" 