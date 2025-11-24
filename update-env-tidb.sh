#!/bin/bash
# Quick script to update .env with TiDB connection
# Usage: bash update-env-tidb.sh YOUR_PASSWORD

if [ -z "$1" ]; then
    echo "❌ Error: Password required"
    echo "Usage: bash update-env-tidb.sh YOUR_PASSWORD"
    exit 1
fi

PASSWORD="$1"

# Backup .env
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
fi

# Update DATABASE_URL
if grep -q "^DATABASE_URL=" .env 2>/dev/null; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=\"mysql://3NEjqDkMJVJsKVk.root:${PASSWORD}@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict\"|" .env
    else
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"mysql://3NEjqDkMJVJsKVk.root:${PASSWORD}@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict\"|" .env
    fi
    echo "✅ DATABASE_URL updated in .env"
else
    echo "DATABASE_URL=\"mysql://3NEjqDkMJVJsKVk.root:${PASSWORD}@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict\"" >> .env
    echo "✅ DATABASE_URL added to .env"
fi

echo ""
echo "✅ Done! Now run: npm run check-db"
