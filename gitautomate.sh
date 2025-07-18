#!/bin/bash

timestamp=$(date "+%d-%m-%Y %H:%M:%S")

changed_files=$(git status --porcelain | awk '{print $2}')

for file in $changed_files; do
    git add "$file"
    git commit -m "updated $file on $timestamp"
done

git push 