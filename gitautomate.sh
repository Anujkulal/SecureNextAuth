#!/bin/bash

timestamp=$(date "+%d-%m-%Y %H:%M:%S")

changed_files=$(git status --porcelain | awk '{print $2}')

for file in $changed_files; do
    git add "$file"
    filename=$(basename "$file")
    git commit -m "updated $filename on $timestamp"
    # echo "$filename"
done

git push 