#!/bin/bash
set -e

cd /Users/Moataz/hotels-vendors
OUT="public/videos/demo-hero.mp4"
POSTER="public/videos/demo-hero-poster.jpg"

mkdir -p public/videos

# Scene data: "duration|title|subtitle|desc|highlight"
SCENES=(
  "3|Hotels Vendors|Digital Procurement Hub|AI-Powered • ETA-Compliant • Egypt First|"
  "3|The Problem|15+ Hours Wasted Weekly|WhatsApp • Excel • Late Delivery • Cash Flow|Procurement Pain"
  "3|Our Solution|One Platform. Zero Friction.|Hotels • Suppliers • Logistics • Factoring|Four-Sided Marketplace"
  "3|Verified Suppliers|68+ KYC-Checked Partners|HACCP • ISO • On-Site Audits • Real-Time|Quality Assured"
  "3|AI-Powered Procurement|Save 20-30% on Costs|Smart Deals • Auto POs • Authority Matrix|Intelligent Buying"
  "3|100% ETA Compliant|Digital Signing Built-In|Zero Penalties • Auto UUID • Real-Time Status|Tax Authority Ready"
  "3|Embedded Factoring|Get Paid in 24-48 Hours|Non-Recourse • Zero Risk • Instant Liquidity|Cash Flow Solved"
  "3|Join Hotels Vendors|Transform Procurement Today|Free 14-Day Trial • No Credit Card|hotelsvendors.com"
)

# Build filter_complex
FILTER=""
INPUTS=""
CONCAT=""
idx=0

for scene in "${SCENES[@]}"; do
  IFS='|' read -r dur title subtitle desc highlight <<< "$scene"
  
  # Color background with subtle red tint
  INPUTS+=" -f lavfi -i color=c=black:s=1280x720:d=$dur"
  
  # Title (top)
  FILTER+="[$idx:v]drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:fontsize=16:fontcolor=#dc2626:x=(w-text_w)/2:y=50:text='$title':alpha='if(lt(t,0.3),0,if(lt(t,0.8),(t-0.3)/0.5,1))',"
  
  # Subtitle (main)
  FILTER+="drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:fontsize=42:fontcolor=white:x=(w-text_w)/2:y=220:text='$subtitle':alpha='if(lt(t,0.5),0,if(lt(t,1.0),(t-0.5)/0.5,1))',"
  
  # Description
  FILTER+="drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:fontsize=22:fontcolor=#888888:x=(w-text_w)/2:y=320:text='$desc':alpha='if(lt(t,0.7),0,if(lt(t,1.2),(t-0.7)/0.5,1))',"
  
  # Highlight badge (if present)
  if [ -n "$highlight" ]; then
    FILTER+="drawtext=fontfile=/System/Library/Fonts/Helvetica.ttc:fontsize=20:fontcolor=#ef4444:x=(w-text_w)/2:y=420:text='$highlight':box=1:boxcolor=#dc262620:boxborderw=12:alpha='if(lt(t,0.9),0,if(lt(t,1.4),(t-0.9)/0.5,1))',"
  fi
  
  # Progress dots
  total=${#SCENES[@]}
  dot_y=680
  for ((d=0; d<total; d++)); do
    dot_x=$((570 + d * 25))
    if [ $d -eq $idx ]; then
      FILTER+="drawbox=x=$dot_x:y=$dot_y:w=10:h=10:color=#dc2626:t=fill:enable='between(t\,0\,$dur)',"
    else
      FILTER+="drawbox=x=$((dot_x+2)):y=$((dot_y+2)):w=6:h=6:color=#333333:t=fill:enable='between(t\,0\,$dur)',"
    fi
  done
  
  # Fade out at end
  fade_start=$(echo "$dur - 0.3" | bc)
  FILTER+="fade=t=out:st=$fade_start:d=0.3[v$idx];"
  
  CONCAT+="[v$idx]"
  ((idx++))
done

# Concatenate all scenes
FILTER+="${CONCAT}concat=n=$idx:v=1:a=0[outv]"

echo "Building video with ffmpeg..."
ffmpeg -y $INPUTS -filter_complex "$FILTER" -map "[outv]" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 28 "$OUT" 2>&1

# Extract poster (frame at 0.5s of first scene)
ffmpeg -y -i "$OUT" -ss 0.5 -vframes 1 -q:v 2 "$POSTER" 2>&1

echo "✅ Video: $OUT"
echo "✅ Poster: $POSTER"
ls -lh "$OUT" "$POSTER"
