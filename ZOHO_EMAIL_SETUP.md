# Zoho Email Setup for @hotelsvendors.com

## Current Status
You have a Zoho subscription for `@hotelsvendors.com` email. Here's how to connect it.

## Option A: Zoho as Primary Email (Recommended for Inbound)

### Step 1: Verify Domain in Zoho Mail
1. Log in to [Zoho Mail Admin Console](https://mail.zoho.com/cpanel/)
2. Go to **Domains** → **Add Domain** → Enter `hotelsvendors.com`
3. Zoho will give you DNS records to add:
   - **TXT record** (domain verification): `zoho-verification=zb12345678.zmverify.zoho.com`
   - **MX records** (mail routing): Point to `mx.zoho.com` and `mx2.zoho.com`
   - **SPF record**: `v=spf1 include:zoho.com ~all`
   - **DKIM record**: Zoho provides a unique key

### Step 2: Add DNS Records at Your Registrar
Log in to wherever you bought `hotelsvendors.com` (GoDaddy, Namecheap, etc.) and add the records from Step 1.

### Step 3: Create Email Accounts
In Zoho Admin → **Users** → Create:
- `outreach@hotelsvendors.com` (for outbound pipeline)
- `team@hotelsvendors.com` (general)
- Your personal admin address

### Step 4: Wait for Propagation
DNS changes take 15 minutes to 48 hours. Zoho will show "Verified" when ready.

## Option B: Resend API for Outbound Pipeline + Zoho for Inbound

This is what the outreach script uses — **Resend handles sending, Zoho handles receiving**.

### Resend Setup (Already Configured in Code)
1. Sign up at [resend.com](https://resend.com)
2. Verify domain `hotelsvendors.com` (adds DKIM/SPF automatically)
3. Get API key → set as `RESEND_API_KEY` in Vercel env vars
4. Set `RESEND_FROM=outreach@hotelsvendors.com`

### Connect Zoho + Resend
In Zoho Admin → **Email Routing** → Add route:
- **Pattern**: `outreach@hotelsvendors.com`
- **Destination**: Keep local (for receiving replies)
- **SPF**: Add `include:resend.net` to your SPF record

### Vercel Environment Variables Needed
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=outreach@hotelsvendors.com
```

Set these in Vercel Dashboard → Project → Settings → Environment Variables.

### Run the Outbound Pipeline
```bash
# Dry run first (no emails sent)
npx tsx src/scripts/execute-outreach.ts --dry-run

# Live execution with Zoho/Resend
npx tsx src/scripts/execute-outreach.ts --sector=HOTEL
npx tsx src/scripts/execute-outreach.ts --sector=FINANCIAL
```

## Troubleshooting
- **Emails going to spam?** Ensure DKIM and SPF are properly configured
- **Resend domain not verified?** Check that DNS records propagated (use `dig` or [dnschecker.org](https://dnschecker.org))
- **Zoho not receiving?** Verify MX records point to `mx.zoho.com` priority 10, `mx2.zoho.com` priority 20
- **SSL warnings?** Zoho auto-provisions SSL once domain is verified
