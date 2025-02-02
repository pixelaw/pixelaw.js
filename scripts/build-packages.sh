#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define an array of package directories
packages=(
  "packages/core"
  "packages/core-dojo"
  "packages/core-mud"
  "packages/react"
  "packages/vanilla"

)

# Iterate over each package directory and run the build command
for package in "${packages[@]}"; do
  echo "Building $package..."
  pnpm --dir "$package" install
  pnpm --dir "$package" build

  # Run tests only for non-wasm packages, non-torii-client packages, and create-dojo
  if [[ "$package" != *"-wasm" && "$package" != "packages/torii-client" && "$package" != "packages/create-dojo" ]]; then
    pnpm --dir "$package" test
  fi
done

echo "Build completed successfully."
