FROM python:3.8-alpine3.12

# Add Circle CI required tools for primary containers
RUN apk --no-cache add git openssh-client

# Install awscli and aws-sam-cli
RUN apk --no-cache add --virtual builddeps gcc musl-dev \
        && pip --no-cache-dir install awscli aws-sam-cli \
        && apk del builddeps

# Install dependencies
RUN apk --no-cache add make nodejs npm

RUN adduser -D -h /home/samcli samcli

USER samcli

ENV SAM_CLI_TELEMETRY 0

WORKDIR /home/samcli
