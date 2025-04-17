#!/bin/bash

# Build the app
npm run build

# Copy migrations to dist
mkdir -p dist/drizzle
cp -r drizzle/* dist/drizzle/ 