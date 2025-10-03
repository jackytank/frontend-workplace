#!/bin/sh

# Prompt the user for the commit message
echo "Enter commit message:"
read commit_msg

# Add all changes
git add .

# Commit with the provided message
git commit -m "$commit_msg"

# Push to the default remote branch
git push