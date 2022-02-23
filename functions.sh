#!/bin/bash

set -aeux

main() {
  "${@}"
}

build() {
  rm -rf build/
  npx esbuild \
    --bundle \
    --format=cjs \
    --minify \
    --outfile=build/lambda.js \
    --platform=node \
    src/lambda.ts
}

deploy() {
  npx cdktf deploy --auto-approve
}

lint() {
  npx eslint \
    --fix \
    --format compact \
    --report-unused-disable-directives \
    .
}

test() {
  local -r url="https://${1:?}/login"

  curl "$url" \
    --data "{\"name\":\"${ADMIN_USERNAME:?}\",\"password\":\"${ADMIN_PASSWORD:?}\"}" \
    --header 'content-type: application/json' \
    --verbose
}

main "${@}"
