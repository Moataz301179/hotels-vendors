# Check Deploy Status

Reports the current production deployment status of hotels-vendors.

## Steps

1. Check GitHub Actions runs:
   ```bash
   gh run list --limit 5
   ```
2. Check the latest `deploy.yml` run specifically:
   ```bash
   gh run list --workflow=deploy.yml --limit 3
   ```
3. Probe the live health endpoint:
   ```bash
   curl -s -o /dev/null -w "HTTP %{http_code}\n" https://www.hotelsvendors.com/api/health
   ```

## Output

- Latest workflow runs + their conclusions (success/failure/in_progress)
- Whether any run is currently deploying (in_progress)
- Live health code — `200` = app up, otherwise report the code and suggest the deploy skill for troubleshooting
