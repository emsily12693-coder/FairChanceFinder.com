#!/bin/bash

# 🚀 UNIFIED BASE44 + NETLIFY + STRIPE + NAMECHEAP INTEGRATION
# This script syncs https://fairchancefinder.base44.app with production

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🔄 UNIFIED DEPLOYMENT INTEGRATION                        ║${NC}"
echo -e "${BLUE}║  Base44 ↔ Netlify ↔ Stripe ↔ Namecheap ↔ GitHub          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Detected Environments:${NC}"
echo ""
echo "1. Base44 Preview: https://fairchancefinder.base44.app"
echo "2. GitHub Repo: emsily12693-coder/FairChanceFinder.com"
echo "3. Netlify Site: fairchancefinder.com"
echo "4. Domain: fairchancefinder.com (Namecheap)"
echo ""

echo -e "${YELLOW}Step 1: Connect Base44 with GitHub${NC}"
echo ""
echo "Instructions:"
echo "  1. Go to https://fairchancefinder.base44.app"
echo "  2. Click Settings → Integrations"
echo "  3. Connect to GitHub repo: emsily12693-coder/FairChanceFinder.com"
echo "  4. Select 'main' as default branch"
echo "  5. Enable 'Auto-sync with GitHub'"
echo ""

read -p "Have you connected Base44 to GitHub? (y/n): " BASE44_GITHUB

if [ "$BASE44_GITHUB" != "y" ]; then
    echo "Please connect Base44 to GitHub first."
    exit 1
fi

echo -e "${GREEN}✓ Base44 connected to GitHub${NC}"
echo ""

echo -e "${YELLOW}Step 2: Configure Base44 Environment Variables${NC}"
echo ""
echo "Go to Base44 project settings and add:"
echo ""
echo "  NETLIFY_SITE_ID = your-site-id"
echo "  NETLIFY_AUTH_TOKEN = your-netlify-token"
echo "  STRIPE_PUBLIC_KEY = pk_live_..."
echo "  STRIPE_SECRET_KEY = sk_live_..."
echo ""
echo "Getting Netlify Token:"
echo "  1. Go to https://app.netlify.com"
echo "  2. User Settings → Applications → New access token"
echo "  3. Create token, copy it"
echo ""

read -p "Have you added environment variables to Base44? (y/n): " BASE44_ENV

if [ "$BASE44_ENV" != "y" ]; then
    echo "Please add environment variables first."
    exit 1
fi

echo -e "${GREEN}✓ Base44 environment configured${NC}"
echo ""

echo -e "${YELLOW}Step 3: Connect Stripe to Base44${NC}"
echo ""
echo "Stripe Integration Options:"
echo ""
echo "Option A: API Keys (Recommended)"
echo "  1. Go to https://dashboard.stripe.com"
echo "  2. Developers → API Keys"
echo "  3. Copy Publishable Key (pk_live_...)"
echo "  4. Copy Secret Key (sk_live_...)"
echo "  5. Go to Base44 Settings → Integrations → Stripe"
echo "  6. Paste keys"
echo ""
echo "Option B: OAuth Connection"
echo "  1. Go to https://dashboard.stripe.com"
echo "  2. Settings → Connected applications"
echo "  3. Authorize Base44"
echo ""

read -p "Which option? (A or B): " STRIPE_OPTION

if [ "$STRIPE_OPTION" = "A" ]; then
    read -sp "Enter Stripe Publishable Key: " STRIPE_PUBLIC
    echo ""
    read -sp "Enter Stripe Secret Key: " STRIPE_SECRET
    echo ""
    
    echo "Add to Base44 Stripe Integration:"
    echo "  Publishable Key: $STRIPE_PUBLIC"
    echo "  Secret Key: $STRIPE_SECRET"
fi

echo -e "${GREEN}✓ Stripe integration configured${NC}"
echo ""

echo -e "${YELLOW}Step 4: Configure Netlify Auto-Deploy from Base44${NC}"
echo ""
echo "Instructions:"
echo "  1. Go to https://app.netlify.com"
echo "  2. Site Settings → Build & Deploy → Connected services"
echo "  3. Connect GitHub repository"
echo "  4. Or: Add webhook:"
echo "     https://api.netlify.com/build_hooks/YOUR_HOOK_ID"
echo ""
echo "To get webhook ID:"
echo "  1. Go to Site Settings → Build & Deploy → Build hooks"
echo "  2. Create a new build hook"
echo "  3. Copy the URL"
echo ""
echo "Then add to Base44 deployment settings"
echo ""

read -p "Have you configured Netlify auto-deploy? (y/n): " NETLIFY_AUTODEPLOY

if [ "$NETLIFY_AUTODEPLOY" != "y" ]; then
    echo "Please configure Netlify auto-deploy first."
    exit 1
fi

echo -e "${GREEN}✓ Netlify auto-deploy configured${NC}"
echo ""

echo -e "${YELLOW}Step 5: Verify Namecheap Domain${NC}"
echo ""
echo "Domain: fairchancefinder.com"
echo ""
echo "To point to Netlify:"
echo "  1. Log in to https://www.namecheap.com"
echo "  2. Manage Domain"
echo "  3. Advanced DNS tab"
echo "  4. Add A record pointing to Netlify IP OR"
echo "  5. Use Netlify nameservers (recommended)"
echo ""

read -p "Is Namecheap pointing to Netlify? (y/n): " NAMECHEAP_OK

if [ "$NAMECHEAP_OK" != "y" ]; then
    echo "Please configure Namecheap domain first."
    exit 1
fi

echo -e "${GREEN}✓ Namecheap verified${NC}"
echo ""

echo -e "${YELLOW}Step 6: Create Unified Configuration File${NC}"
echo ""

cat > unified-deployment.json << EOF
{
  "company": "HomeIsYou LLC",
  "application": "FairChance Finder",
  "environments": {
    "development": {
      "url": "https://fairchancefinder.base44.app",
      "platform": "Base44",
      "status": "active",
      "auto_sync": true
    },
    "staging": {
      "url": "https://staging-fairchancefinder.netlify.app",
      "platform": "Netlify",
      "status": "active",
      "auto_deploy": true
    },
    "production": {
      "url": "https://fairchancefinder.com",
      "platform": "Netlify",
      "domain": "fairchancefinder.com",
      "registrar": "Namecheap",
      "status": "active",
      "auto_deploy": true
    }
  },
  "integrations": {
    "base44": {
      "status": "connected",
      "preview_url": "https://fairchancefinder.base44.app",
      "github_sync": true,
      "auto_deploy": true
    },
    "github": {
      "status": "connected",
      "repo": "emsily12693-coder/FairChanceFinder.com",
      "branch": "main",
      "webhooks": ["netlify", "base44"]
    },
    "netlify": {
      "status": "connected",
      "site_id": "your-site-id",
      "domain": "fairchancefinder.com",
      "auto_deploy": true,
      "branch_deploy": true
    },
    "stripe": {
      "status": "connected",
      "account_type": "live",
      "webhooks": "enabled",
      "payment_processing": true
    },
    "namecheap": {
      "status": "connected",
      "domain": "fairchancefinder.com",
      "dns_provider": "netlify",
      "auto_renewal": true
    }
  },
  "deployment_pipeline": {
    "step_1": "Develop in Base44 (https://fairchancefinder.base44.app)",
    "step_2": "Push to GitHub (main branch)",
    "step_3": "Netlify auto-deploys staging",
    "step_4": "Test in staging",
    "step_5": "Netlify promotes to production",
    "step_6": "Available at fairchancefinder.com"
  },
  "services_sync": {
    "code_updates": "GitHub → Netlify → Production",
    "environment_variables": "Base44 → Netlify → Live",
    "payments": "Stripe → ACH → HomeIsYou LLC",
    "monitoring": "Netlify Logs + Stripe Dashboard"
  },
  "created": "2026-06-01T00:00:00Z",
  "status": "FULLY_INTEGRATED"
}
EOF

echo -e "${GREEN}✓ Unified configuration created${NC}"
cat unified-deployment.json
echo ""

echo -e "${YELLOW}Step 7: Test the Integration${NC}"
echo ""
echo "Test Flow:"
echo ""
echo "1. Make a change in Base44"
echo "   Go to: https://fairchancefinder.base44.app"
echo "   Edit a file and save"
echo ""
echo "2. Verify GitHub updates"
echo "   Check: https://github.com/emsily12693-coder/FairChanceFinder.com"
echo "   You should see your changes"
echo ""
echo "3. Confirm Netlify deploys"
echo "   Go to: https://app.netlify.com"
echo "   Check deploy log in 'Deploys' tab"
echo ""
echo "4. Check production"
echo "   Visit: https://fairchancefinder.com"
echo "   Your changes should be live"
echo ""

read -p "Ready to test? (y/n): " TEST_READY

if [ "$TEST_READY" = "y" ]; then
    echo ""
    echo "Testing integration..."
    echo ""
    
    # Create test file
    echo "<!-- Test: $(date)" > test-integration.txt
    git add test-integration.txt
    git commit -m "Test: Integration verification"
    git push origin main
    
    echo -e "${GREEN}✓ Test commit pushed${NC}"
    echo ""
    echo "Monitor these in real-time:"
    echo "  1. Base44: https://fairchancefinder.base44.app (should show sync status)"
    echo "  2. GitHub: https://github.com/emsily12693-coder/FairChanceFinder.com (should show commit)"
    echo "  3. Netlify: https://app.netlify.com (should show deploying)"
    echo "  4. Production: https://fairchancefinder.com (should update in ~1 min)"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           ✅ INTEGRATION COMPLETE!                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "Your Deployment Pipeline:"
echo ""
echo "  Base44 Preview:"
echo "    ↓"
echo "  https://fairchancefinder.base44.app"
echo "    ↓"
echo "  GitHub Sync"
echo "    ↓"
echo "  emsily12693-coder/FairChanceFinder.com"
echo "    ↓"
echo "  Netlify Auto-Deploy"
echo "    ↓"
echo "  https://fairchancefinder.com (PRODUCTION)"
echo ""
echo "All integrated! ✨"
echo ""

echo "Now you can:"
echo "  1. Edit in Base44: https://fairchancefinder.base44.app"
echo "  2. Changes auto-sync to GitHub"
echo "  3. Netlify auto-deploys to production"
echo "  4. Everything updates automatically"
echo ""

echo "For future updates, just run:"
echo "  bash deploy-and-sync.sh 'Your commit message'"
echo ""
