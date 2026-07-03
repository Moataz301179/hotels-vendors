# INVO Bridge Client

The official bridge client for Hotels Vendors → INVO API communication.

## What is INVO?

INVO is the infrastructure layer powering Egypt's hospitality supply chain:
- **Catalog Sync** — Push inventory via REST or webhooks
- **Route Engine** — Shared logistics optimization
- **Payment Rails** — InstaPay, Fawry, PayMob, CIB integration
- **ETA Bridge** — Egyptian Tax Authority e-invoicing
- **Authority Matrix** — Multi-signature approval chains

## Usage

```typescript
import { getCatalog, syncCatalogItem, getDeliveryQuote } from "@/lib/invo";

// List catalog items
const { data } = await getCatalog({ category: "F&B", page: 1, limit: 20 });

// Create/update a catalog item
await syncCatalogItem({
  sku: "HV-FB-001",
  name: "Extra Virgin Olive Oil 5L",
  supplierId: "sup_1",
  price: 12500,
  quantity: 500,
  unit: "bottle",
});

// Get a delivery quote
const quote = await getDeliveryQuote({
  pickup: { lat: 30.04, lng: 31.23 },
  dropoff: { lat: 27.25, lng: 33.81 },
  weightKg: 150,
  urgency: "standard",
});
```

## Environment Variables

```bash
# Required
INVO_API_URL=http://localhost:3000/api/v1/invo
INVO_SERVICE_KEY=your-secret-key

# Optional
INVO_TIMEOUT_MS=10000
INVO_RETRIES=3
```

## API Documentation

Visit `/invo/docs` for full OpenAPI-style documentation, or call `getDocs()` from the client.
