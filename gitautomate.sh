#!/bin/bash

timestamp=$(date "+%d-%m-%Y %H:%M:%S")
git add .
git commit -m "updated on $timestamp"
git push