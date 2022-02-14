#!/bin/sh

docker build . --file - <<-EOF
  FROM amd64/amazonlinux

  RUN yum install -y gcc-c++ make
  RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash -
  RUN yum install -y nodejs

  WORKDIR /app

  COPY package.json package-lock.json ./
  RUN npm ci

  COPY tsconfig.build.json tsconfig.json ./
  COPY src/ ./src/
  RUN npx tsc --project tsconfig.build.json

  COPY .env serverless.json ./
  RUN npx sls deploy --verbose

  ENTRYPOINT [ "tail", "-f", "/dev/null" ]
EOF
