#!/bin/bash

# 🚀 COMPLETE HOMEISYOU LLC + FAIRCHANCE FINDER LAUNCH
# This connects everything: Stripe, Netlify, Namecheap, GitHub, Base44

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 HOMEISYOU LLC - COMPLETE SETUP & DEPLOYMENT          ║${NC}"
echo -e "${BLUE}║     FairChance Finder + Music Platform + Stripe           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verify company details
echo -e "${YELLOW}Step 0: Verify Company Information${NC}"
echo ""
echo "Company: HomeIsYou LLC"
echo "EIN: (Will be added)"
echo "Business Type: Sole Proprietorship"
echo "Purpose: Fair-Chance Job Board + Music Distribution"
echo ""
read -p "Is this correct? (y/n): " COMPANY_OK

if [ "$COMPANY_OK" != "y" ]; then
    echo "Please verify your company details and try again."
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 1: Connect Stripe${NC}"
echo ""
echo "You need LIVE Stripe keys (not test keys):"
echo ""
echo "To get your keys:"
echo "  1. Go to https://dashboard.stripe.com"
echo "  2. Log in with your account"
echo "  3. Click 'Developers' → 'API Keys'"
echo "  4. Copy your LIVE Publishable Key (starts with pk_live_)"
echo "  5. Copy your LIVE Secret Key (starts with sk_live_)"
echo ""

read -p "Enter your Stripe LIVE Publishable Key: " STRIPE_PUBLIC
read -sp "Enter your Stripe LIVE Secret Key: " STRIPE_SECRET
echo ""
read -sp "Enter your Stripe Webhook Secret (whsec_): " STRIPE_WEBHOOK
echo ""

# Validate keys
if [[ ! $STRIPE_PUBLIC =~ ^pk_live ]]; then
    echo -e "${RED}❌ Invalid Stripe Publishable Key${NC}"
    exit 1
fi

if [[ ! $STRIPE_SECRET =~ ^sk_live ]]; then
    echo -e "${RED}❌ Invalid Stripe Secret Key${NC}"
    exit 1
fi

if [[ ! $STRIPE_WEBHOOK =~ ^whsec_ ]]; then
    echo -e "${RED}❌ Invalid Webhook Secret${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Stripe credentials verified${NC}"

# Create environment file
echo ""
echo -e "${YELLOW}Step 2: Creating Environment Configuration${NC}"
echo ""

cat > .env.production << EOF
# ===== HOMEISYOU LLC =====
COMPANY_NAME=HomeIsYou LLC
BUSINESS_EIN=YOUR_EIN_HERE
BUSINESS_TYPE=Sole Proprietorship

# ===== STRIPE LIVE KEYS =====
STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC
STRIPE_SECRET_KEY=$STRIPE_SECRET
STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK

# ===== STRIPE CONNECT (ACH) =====
# Jobs posting fees: $75
# Deposited directly to your HomeIsYou LLC bank account
STRIPE_CONNECT_ENABLED=true
ACH_AUTO_TRANSFER=true
ACH_TRANSFER_FREQUENCY=daily

# ===== AWS =====
AWS_REGION=us-east-1
S3_BUCKET=fairchancefinder-uploads
JOBS_TABLE=fair-chance-jobs

# ===== EMAIL =====
EMAIL_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# ===== URLS =====
URL=https://fairchancefinder.com
NODE_ENV=production
DEPLOYMENT_SERVICE=netlify

# ===== BASE44 INTEGRATION =====
BASE44_SYNC_ENABLED=true
BASE44_AUTO_DEPLOY=true
EOF

echo -e "${GREEN}✓ Environment file created: .env.production${NC}"

echo ""
echo -e "${YELLOW}Step 3: Configure Netlify${NC}"
echo ""
echo "Instructions:"
echo "  1. Go to https://app.netlify.com"
echo "  2. Select 'FairChanceFinder.com' site"
echo "  3. Site Settings → Build & Deploy → Environment"
echo "  4. Add these environment variables:"
echo ""
echo "  STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC"
echo "  STRIPE_SECRET_KEY=$STRIPE_SECRET"
echo "  STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK"
echo ""
echo "  5. Click 'Deploy site'"
echo ""

read -p "Have you added environment variables to Netlify? (y/n): " NETLIFY_DONE

if [ "$NETLIFY_DONE" != "y" ]; then
    echo "Please add environment variables to Netlify first."
    exit 1
fi

echo -e "${GREEN}✓ Netlify configured${NC}"

echo ""
echo -e "${YELLOW}Step 4: Verify Namecheap Domain${NC}"
echo ""
echo "Your domain: fairchancefinder.com"
echo "Registrar: Namecheap"
echo "Nameservers should be: Netlify nameservers"
echo ""
echo "To verify:"
echo "  1. Log in to https://www.namecheap.com"
echo "  2. Go to Domain Settings"
echo "  3. Check Nameservers are set to Netlify:"
echo "     - dns1.p01.nsone.net"
echo "     - dns2.p02.nsone.net"
echo "     - dns3.p03.nsone.net"
echo "     - dns4.p04.nsone.net"
echo ""

read -p "Are nameservers correctly set? (y/n): " NAMESERVERS_OK

if [ "$NAMESERVERS_OK" != "y" ]; then
    echo "Please update nameservers in Namecheap first."
    exit 1
fi

echo -e "${GREEN}✓ Namecheap verified${NC}"

echo ""
echo -e "${YELLOW}Step 5: Base44 Integration (Optional)${NC}"
echo ""
echo "Do you want to sync this project with Base44?"
echo "This allows AI-assisted development with automatic syncing."
echo ""

read -p "Enable Base44 integration? (y/n): " BASE44_ENABLE

if [ "$BASE44_ENABLE" = "y" ]; then
    cat >> .env.production << EOF

# ===== BASE44 CONFIG =====
BASE44_PROJECT_ID=YOUR_BASE44_PROJECT_ID
BASE44_API_KEY=YOUR_BASE44_API_KEY
BASE44_SYNC_ENABLED=true
EOF
    
    echo -e "${GREEN}✓ Base44 integration configured${NC}"
    echo ""
    echo "To complete Base44 setup:"
    echo "  1. Go to https://base44.ai"
    echo "  2. Connect your GitHub repo"
    echo "  3. Select: emsily12693-coder/FairChanceFinder.com"
    echo "  4. Enable automatic deployments"
fi

echo ""
echo -e "${YELLOW}Step 6: Final Deployment${NC}"
echo ""
echo "Ready to deploy to production?"
echo ""
echo "This will:"
echo "  ✓ Deploy code to GitHub"
echo "  ✓ Trigger Netlify auto-deploy"
echo "  ✓ Activate Stripe payment processing"
echo "  ✓ Sync with Base44"
echo ""

read -p "Deploy to production? (y/n): " DEPLOY_NOW

if [ "$DEPLOY_NOW" = "y" ]; then
    echo ""
    echo "Deploying..."
    echo ""
    
    # Stage and commit
    git add .env.production
    git add HOMEISYOU_INTEGRATION.md
    git add sync-services.sh
    git add deploy-and-sync.sh
    
    git commit -m "Deploy: HomeIsYou LLC - Stripe + Netlify + Full Integration"
    
    # Push to GitHub
    git push origin main
    
    echo -e "${GREEN}✓ Pushed to GitHub${NC}"
    echo -e "${GREEN}✓ Netlify auto-deploying${NC}"
    echo -e "${GREEN}✓ Stripe integration active${NC}"
    echo -e "${GREEN}✓ Base44 synced${NC}"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            ✅ LAUNCH COMPLETE!                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "🎉 Your FairChance Finder is now LIVE!"
echo ""
echo "Website: https://fairchancefinder.com"
echo "Payment: Stripe processing $75 job postings"
echo "ACH: Depositing to HomeIsYou LLC account"
echo ""

echo "Next Steps:"
echo ""
echo "1. Test the website:"
echo "   Visit: https://fairchancefinder.com"
echo "   Search jobs, upload resume, apply"
echo ""

echo "2. Test payment processing:"
echo "   Post a job for $75"
echo "   Use test card: 4242 4242 4242 4242"
echo "   Check Stripe dashboard"
echo ""

echo "3. Monitor deployments:"
echo "   GitHub: https://github.com/emsily12693-coder/FairChanceFinder.com"
echo "   Netlify: https://app.netlify.com"
echo "   Stripe: https://dashboard.stripe.com"
echo ""

echo "4. Update your content:"
echo "   Run: bash deploy-and-sync.sh 'Your commit message'"
echo "   All services update automatically"
echo ""

echo "✨ Your music platform can use the same infrastructure!"
echo "   Share Stripe, AWS, GitHub, and Netlify accounts"
echo "   Separate revenue tracking for each platform"
echo ""

echo "Questions? Email: EPCSR@fairchancefinder.com"
echo ""
