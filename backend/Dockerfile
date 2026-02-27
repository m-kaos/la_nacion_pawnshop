# Backend Dockerfile (Development)
# Used by docker-compose for local development.
# Source is mounted as a volume — ts-node compiles on the fly.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Patch Vendure ui-devkit to work with Angular 19 output structure
# Angular 19 outputs to dist/browser/ but ui-devkit expects dist/
RUN sed -i "s|path.join(outputPath, 'dist')|path.join(outputPath, 'dist', 'browser')|g" \
    node_modules/@vendure/ui-devkit/compiler/compile.js

COPY . .

RUN mkdir -p static/assets static/email/test-emails static/email/templates/partials static/email/templates/body

# Pre-compile the Admin UI with all custom extensions at image build time.
# This bakes the compiled Angular bundle into the image so the container starts instantly
# without any Angular compilation delay — eliminating the "ng: not found" startup error
# and the 25-second compilation window that caused Railway 502s.
RUN ./node_modules/.bin/ts-node compile-admin-ui.ts

EXPOSE 3001

CMD ["sh", "-c", "./node_modules/.bin/ts-node src/init-db.ts; npm run dev"]
