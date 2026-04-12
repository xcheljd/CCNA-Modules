#!/bin/bash
# Environment setup for CI Quality Gates + Test Coverage mission
# Idempotent — safe to run multiple times

cd /home/x/labs/CCNA-Modules

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  npm install
fi

echo "Environment ready. Tests can be run with: npm test"
