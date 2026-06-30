#!/bin/bash
curl -sf http://localhost:3000/api/health || exit 1
