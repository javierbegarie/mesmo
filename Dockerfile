# Mesmo — containerized build of the shell (static SPA, no backend).
# Multi-stage: build with Node + Nx, serve the static output with nginx.

FROM node:20-alpine AS build
WORKDIR /app

# This is an npm-workspaces monorepo (mesmo/*, packages/*): `npm ci` needs
# every workspace's package.json on disk to link @mesmo/* in node_modules, so
# the source has to be copied in before installing — no separate deps layer.
COPY . .
RUN npm ci
RUN npx nx build mesmo

FROM nginx:alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/mesmo/shell/dist /usr/share/nginx/html

EXPOSE 80
