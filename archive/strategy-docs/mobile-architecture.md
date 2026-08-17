# Mobile App Architecture Specification
*For QDB Submission & Investor Review*

## Overview

The HotelsVendors mobile application synchronizes with the web platform via REST API + WebSocket (optional) with full offline-first capability.

## Architecture Layers

### 1. Presentation Layer (React Native + Expo)
- **Framework:** React Native 0.74 + Expo SDK 50
- **Navigation:** React Navigation v6 (Tab + Stack)
- **State Management:** Zustand + React Query
- **Offline Storage:** MMKV + SQLite

### 2. Data Layer
```
┌─────────────────────────────────────────┐
│           Mobile Client                 │
├─────────────────────────────────────────┤
│  Zustand Store │ React Query Cache     │
├─────────────────────────────────────────┤
│  MMKV (Session, Preferences)           │
│  SQLite (Orders, Inventory, Offline)   │
├─────────────────────────────────────────┤
│  API Gateway (REST + WebSocket)         │
└─────────────────────────────────────────┘
```

### 3. Sync Strategy
- **Online:** Real-time REST API calls to `/api/v1/*`
- **Offline:** MMKV/SQLite for local mutations, sync queue when online
- **Conflict Resolution:** Last-write-wins + server timestamp merge

## Key Features Specification

### Barcode Scanner
```typescript
// Feature: Product/Invoice Scanning
- Library: react-native-vision-camera + react-native-mlkit-barcode
- Format: Code-128, QR, EAN-13
- Scan Target: Product SKU, Invoice UUID, PO Number
- Fallback: Manual entry with auto-suggest
```

### Photo Attachments
```typescript
// Feature: Receipt/GRN Photo Capture
- Camera: expo-image-picker
- Compression: 70% JPEG, max 2MB
- Upload: Multipart to /api/v1/invoices/[id]/attachments
- Storage: AWS S3 with presigned URLs
- Validation: MIME type, size, EXIF stripping
```

### OTP & Mobile Registration
```typescript
// Feature: Phone Verification
- Library: expo-otp, react-native-twilio-verify
- Flow: SMS OTP → Voice fallback → Email backup
- Session: JWT + refresh token stored in MMKV
- Rate Limit: 3 attempts / 5 minutes (per number)
```

### WhatsApp Bot Integration
```typescript
// Feature: WhatsApp Chatbot
- Provider: Twilio Conversations API
- Triggers: Order status, payment reminders, alerts
- Template: Pre-approved WhatsApp templates (Meta compliant)
- Fallback: SMS if WhatsApp unavailable
```

### Push Notifications
```typescript
// Feature: Real-time Alerts
- Service: Expo Push Notification Service
- Topics: order_status, payment_due, stock_alert, eta_update
- Payload: { orderId, type, message, priority }
- Priority: High (immediate) | Normal (batch) | Low (digest)
```

### Email Notifications
```typescript
// Feature: Transactional Email
- Provider: nodemailer + AWS SES
- Templates: Order confirmation, invoice issued, payment settled
- Personalization: Dynamic fields via Handlebars
- Delivery: DKIM-signed, SPF-aligned
```

## API Endpoints for Mobile

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/v1/orders` | GET, POST | Order CRUD | Required |
| `/api/v1/orders/[id]/status` | PATCH | Status update | Required |
| `/api/v1/invoices/[id]/attachments` | POST | Photo upload | Required |
| `/api/v1/products/scan` | POST | SKU lookup | Optional |
| `/api/v1/auth/otp` | POST | Phone verification | Optional |
| `/api/v1/notifications` | GET | Fetch notifications | Required |

## Offline-First Behavior

1. **Read Operations:**
   - Network available: Fetch from API, cache in SQLite
   - Network unavailable: Serve from SQLite cache

2. **Write Operations:**
   - Queue mutation in local SQLite
   - Mark as "pending"
   - When online: Send batch sync
   - On conflict: Server wins (timestamp-based)

3. **Sync Queue Schema:**
```sql
CREATE TABLE sync_queue (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,  -- 'order', 'invoice', 'inventory'
  operation TEXT NOT NULL,    -- 'create', 'update', 'delete'
  payload TEXT NOT NULL,      -- JSON data
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  synced_at DATETIME NULL,
  status TEXT DEFAULT 'pending'
);
```

## Platform-Specific Features

### iOS
- Face ID / Touch ID authentication
- Background fetch (30 min intervals)
- Push notifications via APNs

### Android
- Biometric authentication
- Foreground services for sync
- Firebase Cloud Messaging

## QR Code Generation

For supplier QR labels:
```typescript
// API: /api/v1/products/[id]/qr
// Returns SVG or PNG QR code for product SKU
// Printed on packaging for quick scanning
```

## Testing Strategy

| Test Type | Tools | Coverage |
|-----------|-------|----------|
| Unit | Jest + React Native Testing Library | 85% |
| Integration | Detox | Core flows |
| E2E | Appium | Full workflow |
| Offline | Custom test harness | Sync scenarios |

## Deployment

- **App Store:** TestFlight for beta (100 testers), Production
- **Play Store:** Internal testing, Production
- **OTA Updates:** Expo Updates (zero-downtime)
- **Hot Reload:** Enabled in dev mode only
