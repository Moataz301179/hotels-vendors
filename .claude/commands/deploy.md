# Deploy to Production

Triggers and monitors the production deployment of hotels-vendors.

## Process

1. Check current branch and working tree are clean:
   ```bash
   git status --short && git branch --show-current
   ```
2. Push the current `main` to trigger auto-deploy:
   ```bash
   git push origin main
   ```
   (Deploy is automatic on push — `.github/workflows/deploy.yml`, job `deploy-hostinger`.)
3. Watch the run:
   ```bash
   gh run watch
   ```
4. Verify the health endpoint returns 200:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://www.hotelsvendors.com/api/health
   ```

## Output

Report:
- Whether the push triggered a new run (run ID/number)
- Status of `ci` and `deploy-hostinger` jobs
- Health check HTTP code — only declare success if it's `200`

## Notes

- If the user asked for a manual deploy without a new commit, use `gh workflow run deploy.yml --ref main` instead of pushing.
- Never say "deployed" until the Actions run is green AND the health check returns 200.
