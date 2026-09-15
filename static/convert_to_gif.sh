#!/bin/bash

input="js13k2026_gameplay_2_short_3.mp4"
output="js13k2026_gameplay_2_short_3_v1.gif"
vf="fps=30,scale=480:-1"

ffmpeg -i $input -vf "${vf},palettegen" -y palette.tmp.png
ffmpeg -i $input -i palette.tmp.png -filter_complex "[0:v]${vf}[x];[x][1:v]paletteuse" -y $output
