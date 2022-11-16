#!/bin/sh

source .env
# Encrypt the file
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --symmetric --cipher-algo AES256 --passphrase="$ENV_SECRET" .env
