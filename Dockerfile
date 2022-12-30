FROM node:18.4.0-alpine as backend_builder

WORKDIR /app

RUN npm i -g pnpm
COPY ./ ./
RUN pnpm install
RUN pnpm build

FROM debian:stable-20211011-slim AS litestream_downloader

ARG litestream_version="v0.3.9"
ARG litestream_binary_tgz_filename="litestream-${litestream_version}-linux-amd64-static.tar.gz"

WORKDIR /litestream

RUN set -x && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
      ca-certificates \
      wget
RUN wget "https://github.com/benbjohnson/litestream/releases/download/${litestream_version}/${litestream_binary_tgz_filename}"
RUN tar -xvzf "${litestream_binary_tgz_filename}"

FROM node:18.4.0-alpine

RUN apk add --no-cache bash

COPY --from=backend_builder /app/dist /app/dist
COPY --from=litestream_downloader /litestream/litestream /app/litestream
COPY ./docker_entrypoint /app/docker_entrypoint
COPY ./litestream.yml /etc/litestream.yml


WORKDIR /app

# Frequency that database snapshots are replicated.
ENV DB_SYNC_INTERVAL="10s"

ENTRYPOINT ["/app/docker_entrypoint"]