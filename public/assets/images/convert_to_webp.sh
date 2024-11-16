#!/bin/bash

# Define quality for webp conversion
QUALITY=80

# Loop through all PNG files in the current directory
for file in *.png; do
  # Extract the filename without extension
  filename="${file%.*}"
  
  # Convert to webp
  cwebp "$file" -q $QUALITY -o "${filename}.webp"
  
  # Print conversion success message
  echo "Converted $file to ${filename}.webp"
done
