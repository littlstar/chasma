#!/bin/bash

file="$1"
browserify -t babelify $file -o "`dirname $file`/build.js"
