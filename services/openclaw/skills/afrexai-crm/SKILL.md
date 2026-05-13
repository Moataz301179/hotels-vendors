# AfrexAI CRM Skill

## Purpose
Manage hotel and supplier relationships through automated outreach, follow-ups, meeting scheduling, and pipeline tracking using browser automation and data extraction.

## When to Use
- New lead needs nurturing sequence
- Existing customer needs reorder reminder
- Proposal follow-up is overdue
- Contract renewal is approaching
- Churn risk detected

## Pipeline Stages
```
DISCOVERED → ENRICHED → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATING → WON/LOST
```

## Automation Workflows

### Workflow 1: New Lead Nurturing
```
Trigger: Lead created with email
Day 0: Send welcome email + platform overview
Day 2: Send case study (similar hotel)
Day 5: Send product catalog
Day 7: Schedule demo call
Day 14: Send limited-time onboarding offer
Day 21: Final follow-up + survey
```

### Workflow 2: Reorder Reminder
```
Trigger: 21 days since last order
Action: Check order history
If high-frequency buyer: Send "reorder in 3 clicks" email
If irregular: Send "running low?" with personalized suggestions
If inactive 60+ days: Send win-back offer
```

### Workflow 3: Churn Prevention
```
Trigger: Order frequency drops 50% month-over-month
Action 1: Analyze last order — any disputes?
Action 2: Check competitor activity
Action 3: Send personal check-in from account manager
Action 4: Offer loyalty discount
Action 5: Schedule executive call
```

### Workflow 4: Supplier Onboarding
```
Trigger: Supplier signs up
Day 0: Send onboarding checklist
Day 1: Help upload first 10 products
Day 3: Review pricing competitiveness
Day 7: Check first orders received
Day 14: Request feedback
Day 30: Performance review + optimization tips
```

## Outreach Templates

### Cold Hotel Outreach
```
Subject: {Hotel Name} — Reduce procurement costs by 15%

Hi {GM Name},

I noticed {Hotel Name} is a {star}-star property in {city}. 
Hotels like yours typically spend EGP {estimatedMonthly} monthly on procurement.

Hotels Vendors helps properties:
✓ Source from 200+ verified suppliers
✓ Reduce procurement costs by 10-15%
✓ Automate ETA e-invoicing compliance
✓ Get AI-powered reorder suggestions

Would you be open to a 15-minute call next week?

Best,
{Sender}
```

### Supplier Invitation
```
Subject: {Supplier Name} — Your products requested by {Hotel Count} hotels

Hi {Contact Name},

{Hotel Name} and {Hotel Count} other hotels in {Governorate} are looking for {Category} suppliers.

Hotels Vendors connects verified suppliers directly with hotel buyers:
✓ No middleman fees
✓ Direct payments
✓ Guaranteed orders from active hotels
✓ ETA compliance handled

Interested in a 10-minute overview?
```

### Follow-Up (No Response)
```
Subject: Re: {Original Subject} — Quick question

Hi {Name},

I know you're busy. Just one quick question:

Is procurement efficiency a priority for {Hotel Name} this quarter, or should I check back in a few months?

Either way is fine — just want to respect your time.

Best,
{Sender}
```

## CRM Metrics Dashboard
```
- Pipeline value (by stage)
- Conversion rate (lead → customer)
- Average deal size
- Sales cycle length
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Monthly recurring revenue (MRR)
- Churn rate
- Net Promoter Score (NPS)
```

## Hotels Vendors CRM Integration
```
- Read from: leads, hotels, suppliers, orders tables
- Write to: outreach_logs, lead status updates
- Trigger: order patterns, credit utilization, delivery delays
- Alert: GM/CEO when key account at risk
```
