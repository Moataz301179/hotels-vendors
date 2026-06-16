# ETA E-Invoicing Integration Status

**Date:** June 14, 2026  
**Status:** In Progress

## Integration Overview

Hotels Vendors is integrating with the Egyptian Tax Authority (ETA) e-invoicing system per Law 67/2018.

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| ETA API Credentials | ⚪ NOT CONFIGURED | API key and client ID are empty placeholders in .env |
| Invoice Submission | 🟡 In Progress | API routes exist at /api/v1/eta/submit |
| Callback Handling | 🟡 In Progress | API routes exist at /api/v1/eta/callback |
| Status Tracking | ✅ Implemented | etaUuid, etaStatus fields on Invoice model |
| Document Signing | 🟡 In Progress | digitalSignature field exists |

## Required Configuration

The following environment variables must be set before ETA integration is functional:
- `ETA_API_BASE_URL`
- `ETA_CLIENT_ID`
- `ETA_CLIENT_SECRET`
- `ETA_ENCRYPTION_KEY`

## Next Steps

1. Obtain ETA credentials through ETA portal
2. Configure environment variables
3. Test invoice submission in ETA sandbox
4. Complete callback handling for submission status
5. Run end-to-end integration tests
---
*This document is maintained by the Hotels Vendors Engineering Team.*
