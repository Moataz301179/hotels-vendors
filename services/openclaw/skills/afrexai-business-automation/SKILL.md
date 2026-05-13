# AfrexAI Business Automation Skill

## Purpose
Design, execute, and optimize business workflows through browser automation and data extraction. Transform repetitive manual tasks into autonomous agent-run procedures.

## When to Use
- You need to scrape data from multiple pages systematically
- You need to fill forms repeatedly with structured data
- You need to monitor a website for changes
- You need to export data from a web application
- You need to create accounts or register on sites in bulk

## Workflow Patterns

### Pattern 1: Structured Data Extraction
```
1. Navigate to target URL
2. Identify the list container selector
3. For each item, extract: name, price, contact, link
4. If pagination exists, click next and repeat
5. Export as JSON/CSV
```

### Pattern 2: Form Automation
```
1. Navigate to form URL
2. Map form fields to data source
3. Fill each field with appropriate data type
4. Handle CAPTCHAs (pause for human)
5. Submit and capture confirmation
6. Log result
```

### Pattern 3: Change Monitoring
```
1. Navigate to monitored page
2. Extract key data points
3. Compare with previous snapshot (from memory)
4. If changed, alert and store new snapshot
5. Schedule next check
```

### Pattern 4: Multi-Step Workflow
```
1. Navigate to starting URL
2. Perform action A (click, fill, select)
3. Wait for result page
4. Perform action B
5. Continue until goal achieved
6. Capture final state
```

## Best Practices
- ALWAYS wait for page load before interacting
- Use specific selectors (id > class > xpath)
- Handle errors gracefully — log and continue
- Respect rate limits — add delays between requests
- Store session cookies to avoid re-authentication
- Take screenshots on failure for debugging

## Hotels Vendors Specific Workflows

### Supplier Discovery
```
Goal: Find F&B suppliers in 6th of October City
Steps:
1. Search Google Maps / business directories
2. Extract: company name, phone, address, category
3. Cross-check with existing database
4. Score: has website, has tax ID, years in business
5. Store as LEAD in Hotels Vendors database
```

### Competitor Price Monitoring
```
Goal: Track competitor pricing monthly
Steps:
1. Navigate to competitor product pages
2. Extract: product name, price, unit, availability
3. Compare with Hotels Vendors supplier prices
4. Calculate margin difference
5. Alert if competitor undercuts by >10%
```

### Hotel Directory Enrichment
```
Goal: Enrich hotel profiles with online data
Steps:
1. Search hotel website / booking.com / tripadvisor
2. Extract: star rating, room count, amenities, reviews
3. Cross-reference with CR number
4. Update Hotels Vendors hotel record
5. Calculate procurement potential (rooms × avg spend)
```
