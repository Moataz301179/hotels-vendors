# Database Backup Strategy — HotelsVendors

## Automated Backups

The `scripts/backup-db.sh` script performs daily PostgreSQL backups with compression and rotation.

### Setup on VPS

```bash
# 1. Create backup directory
sudo mkdir -p /var/backups/hotels-vendors
sudo chown postgres:postgres /var/backups/hotels-vendors

# 2. Add cron job (run as postgres user)
sudo crontab -e -u postgres
```

Add this line for daily 3 AM backups:

```
0 3 * * * /var/www/hotels-vendors/scripts/backup-db.sh >> /var/log/hotels-vendors-backup.log 2>&1
```

### Manual Run

```bash
cd /var/www/hotels-vendors
./scripts/backup-db.sh
```

### Restore from Backup

```bash
# Decompress
gunzip /var/backups/hotels-vendors/hotels_vendors_20260714_030000.sql.gz

# Restore
docker exec -i hotels-vendors-db psql -U hotels_vendors -d hotels_vendors < /var/backups/hotels-vendors/hotels_vendors_20260714_030000.sql
```

### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PG_CONTAINER` | `hotels-vendors-db` | Docker container name |
| `PG_USER` | `hotels_vendors` | PostgreSQL user |
| `PG_DATABASE` | `hotels_vendors` | Database name |
| `BACKUP_DIR` | `/var/backups/hotels-vendors` | Backup storage path |
| `RETENTION_DAYS` | `30` | Days to keep old backups |

### RPO / RTO Targets

| Metric | Target | Notes |
|--------|--------|-------|
| **RPO** (Recovery Point Objective) | 24 hours | Daily backups at 3 AM |
| **RTO** (Recovery Time Objective) | 4 hours | Full restore + verification |

### Off-Site Backup (Recommended)

For production, add off-site backup to S3 or rsync to secondary server:

```bash
# Example: rsync to secondary server
rsync -avz /var/backups/hotels-vendors/ backup@secondary-server:/hotels-vendors-backups/

# Or upload to S3
aws s3 sync /var/backups/hotels-vendors/ s3://hotels-vendors-backups/ --storage-class STANDARD_IA
```
