#!/bin/bash

ENV_FILE=env_vars.txt
grep -ir 'process.env' * | grep -v 'node_modules' | grep -oP '(?:process.env.)([A-Z_]+)' | cut -d'.' -f3 > $ENV_FILE
