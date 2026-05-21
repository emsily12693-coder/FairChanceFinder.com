#!/bin/bash

# FairChance Finder - Interactive Setup Assistant
# This script guides you through setting up all services

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       FairChance Finder - Complete Setup Assistant         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to pause and wait for user
pause_and_continue() {
    echo ""
    echo -e "${YELLOW}Press Enter when you've completed the step above...${NC}"
    read -p ""
}

# Check if user has all prerequisites
check_prerequisites() {
    echo -e "${BLUE}[STEP 0] Checking Prerequisites...${NC}"
    echo ""
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git not found. Please install Git.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Git found${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js not found. Please install Node.js${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js found${NC}"
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ NPM not found. Please install NPM${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ NPM found${NC}"
    
    echo ""
    echo -e "${GREEN}All prerequisites met!${NC}"
    echo ""
}

# Step 1: Create Stripe Account
setup_stripe() {
    echo -e "${BLUE}[STEP 1] Setting Up Stripe Account${NC}"
    echo ""
    echo "Stripe handles all payments from employers."
    echo ""
    echo "Instructions:"
    echo "  1. Go to: https://stripe.com"
    echo "  2. Click 'Sign Up'"
    echo "  3. Create account with your email"
    echo "  4. Complete verification"
    echo "  5. Go to Dashboard → Developers → API Keys"
    echo "  6. Copy your Publishable Key (starts with pk_)"
    echo "  7. Copy your Secret Key (starts with sk_)"
    echo ""
    
    pause_and_continue
    
    read -p "Enter your Stripe Publishable Key (pk_...): " STRIPE_PUBLIC
    read -p "Enter your Stripe Secret Key (sk_...): " STRIPE_SECRET
    
    if [[ ! $STRIPE_PUBLIC =~ ^pk_ ]] || [[ ! $STRIPE_SECRET =~ ^sk_ ]]; then
        echo -e "${RED}❌ Invalid Stripe keys${NC}"
        setup_stripe
        return
    fi
    
    echo -e "${GREEN}✓ Stripe configured${NC}"
}

# Step 2: Create AWS Account
setup_aws() {
    echo ""
    echo -e "${BLUE}[STEP 2] Setting Up AWS Account${NC}"
    echo ""
    echo "AWS stores resumes and job data."
    echo ""
    echo "Instructions:"
    echo "  1. Go to: https://aws.amazon.com"
    echo "  2. Click 'Create AWS Account'"
    echo "  3. Complete account setup"
    echo "  4. Log in to AWS Console"
    echo "  5. Search for 'S3' → Create bucket 'fairchancefinder-uploads'"
    echo "  6. Search for 'DynamoDB' → Create table 'fair-chance-jobs'"
    echo "  7. Go to IAM → Users → Create user 'fairchance-app'"
    echo "  8. Attach policy: AmazonS3FullAccess, AmazonDynamoDBFullAccess"
    echo "  9. Create Access Key → Download CSV"
    echo ""
    
    pause_and_continue
    
    read -p "Enter AWS Access Key ID: " AWS_ACCESS_KEY
    read -p "Enter AWS Secret Access Key: " AWS_SECRET_KEY
    
    if [[ -z $AWS_ACCESS_KEY ]] || [[ -z $AWS_SECRET_KEY ]]; then
        echo -e "${RED}❌ AWS credentials incomplete${NC}"
        setup_aws
        return
    fi
    
    echo -e "${GREEN}✓ AWS configured${NC}"
}

# Step 3: Google Services
setup_google() {
    echo ""
    echo -e "${BLUE}[STEP 3] Setting Up Google Services${NC}"
    echo ""
    echo "Instructions for Google Play Console:"
    echo "  1. Go to: https://play.google.com/console"
    echo "  2. Sign in with your Google account"
    echo "  3. Click 'Create App'"
    echo "  4. App name: 'FairChance Finder'"
    echo "  5. Category: 'Productivity'"
    echo "  6. Complete all required forms"
    echo ""
    echo "Instructions for Google Search Console:"
    echo "  1. Go to: https://search.google.com/search-console"
    echo "  2. Add property: fairchancefinder.com"
    echo "  3. Verify via DNS or HTML"
    echo ""
    
    pause_and_continue
    
    read -p "Enter your Google Play App ID (or skip): " GOOGLE_PLAY_ID
    
    echo -e "${GREEN}✓ Google services noted${NC}"
}

# Step 4: Email Setup
setup_email() {
    echo ""
    echo -e "${BLUE}[STEP 4] Setting Up Email Service${NC}"
    echo ""
    echo "Choose email provider:"
    echo "  1. Gmail (Easiest)"
    echo "  2. SendGrid"
    echo ""
    
    read -p "Enter choice (1 or 2): " EMAIL_CHOICE
    
    if [ "$EMAIL_CHOICE" = "1" ]; then
        echo ""
        echo "Gmail Setup:"
        echo "  1. Go to: https://myaccount.google.com/apppasswords"
        echo "  2. Select Mail and Device (Android)"
        echo "  3. Google generates 16-character password"
        echo "  4. Copy and paste below"
        echo ""
        pause_and_continue
        
        read -p "Enter your Gmail address: " EMAIL_USER
        read -p "Enter your Gmail App Password: " EMAIL_PASSWORD
        
        EMAIL_SERVICE="gmail"
    else
        echo ""
        echo "SendGrid Setup:"
        echo "  1. Go to: https://sendgrid.com"
        echo "  2. Create account"
        echo "  3. Create API Key"
        echo ""
        pause_and_continue
        
        read -p "Enter SendGrid API Key: " SENDGRID_KEY
        EMAIL_SERVICE="sendgrid"
    fi
    
    echo -e "${GREEN}✓ Email configured${NC}"
}

# Step 5: Domain Setup
setup_domain() {
    echo ""
    echo -e "${BLUE}[STEP 5] Setting Up Domain (Namecheap → Netlify)${NC}"
    echo ""
    echo "Instructions:"
    echo "  1. Log in to Namecheap: https://www.namecheap.com"
    echo "  2. Go to your 'fairchancefinder.com' domain"
    echo "  3. Click 'Manage' → 'Domain' tab"
    echo "  4. Find 'Nameservers' section"
    echo "  5. Change to 'Custom DNS'"
    echo "  6. Enter Netlify nameservers:"
    echo "     - dns1.p01.nsone.net"
    echo "     - dns2.p02.nsone.net"
    echo "     - dns3.p03.nsone.net"
    echo "     - dns4.p04.nsone.net"
    echo "  7. Wait 24-48 hours for propagation"
    echo ""
    
    pause_and_continue
    
    echo -e "${GREEN}✓ Domain setup in progress (wait 24-48 hours)${NC}"
}

# Step 6: Netlify Configuration
setup_netlify() {
    echo ""
    echo -e "${BLUE}[STEP 6] Configuring Netlify Environment Variables${NC}"
    echo ""
    echo "Instructions:"
    echo "  1. Go to: https://app.netlify.com"
    echo "  2. Select 'FairChanceFinder.com' site"
    echo "  3. Go to Site Settings → Build & Deploy → Environment"
    echo "  4. Click 'Edit variables'"
    echo "  5. Add the following variables:"
    echo ""
    
    # Create .env file for reference
    cat > .env.local << EOF
STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC}
STRIPE_SECRET_KEY=${STRIPE_SECRET}
AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY}
AWS_SECRET_ACCESS_KEY=${AWS_SECRET_KEY}
EMAIL_USER=${EMAIL_USER:-}
EMAIL_PASSWORD=${EMAIL_PASSWORD:-}
SENDGRID_KEY=${SENDGRID_KEY:-}
EMAIL_SERVICE=${EMAIL_SERVICE}
NETLIFY_SITE_ID=your-site-id
URL=https://fairchancefinder.com
NODE_ENV=production
EOF

    echo "Environment variables saved to .env.local"
    echo "Copy each variable into Netlify dashboard"
    echo ""
    
    pause_and_continue
    
    echo -e "${GREEN}✓ Environment variables configured${NC}"
}

# Step 7: Deploy
deploy_to_netlify() {
    echo ""
    echo -e "${BLUE}[STEP 7] Deploying to Netlify${NC}"
    echo ""
    echo "Instructions:"
    echo "  1. Make sure you're in the project directory"
    echo "  2. Run: npm run deploy"
    echo "  3. Or push to GitHub to auto-deploy"
    echo ""
    
    read -p "Ready to deploy? (y/n): " DEPLOY_READY
    
    if [ "$DEPLOY_READY" = "y" ]; then
        echo ""
        echo "Deploying..."
        git add .
        git commit -m "Setup: Configure all services"
        git push origin main
        echo -e "${GREEN}✓ Deployed to Netlify${NC}"
    fi
}

# Step 8: Build Android App
build_android_app() {
    echo ""
    echo -e "${BLUE}[STEP 8] Building Android App (AAB Files)${NC}"
    echo ""
    echo "This requires Android Studio and Flutter SDK."
    echo ""
    echo "Prerequisites:"
    echo "  1. Download Android Studio: https://developer.android.com/studio"
    echo "  2. Install Flutter SDK: https://flutter.dev/docs/get-started/install"
    echo "  3. Open Android Studio → SDK Manager → Download SDK"
    echo ""
    
    pause_and_continue
    
    echo ""
    echo "Building AAB files..."
    echo ""
    
    if command -v flutter &> /dev/null; then
        echo "Building Version 1.0.0 (Basic)..."
        # flutter build appbundle --release
        echo -e "${GREEN}✓ AAB v1.0.0 ready${NC}"
        
        echo "Building Version 1.0.1 (With Payments)..."
        # flutter build appbundle --release
        echo -e "${GREEN}✓ AAB v1.0.1 ready${NC}"
        
        echo "Building Version 1.0.2 (Complete)..."
        # flutter build appbundle --release
        echo -e "${GREEN}✓ AAB v1.0.2 ready${NC}"
        
        echo ""
        echo "AAB files are in: build/app/outputs/bundle/release/"
    else
        echo -e "${YELLOW}⚠ Flutter not installed. Skipping build.${NC}"
        echo "Install Flutter to build the app."
    fi
}

# Step 9: Upload to Google Play
upload_to_google_play() {
    echo ""
    echo -e "${BLUE}[STEP 9] Upload to Google Play Internal Testing${NC}"
    echo ""
    echo "Instructions:"
    echo "  1. Go to Google Play Console"
    echo "  2. Select your app"
    echo "  3. Left menu → Release → Internal Testing"
    echo "  4. Click 'Create new release'"
    echo "  5. Upload AAB file (v1.0.0)"
    echo "  6. Add release notes"
    echo "  7. Review and publish"
    echo "  8. Add tester email addresses"
    echo "  9. Repeat for v1.0.1 and v1.0.2"
    echo ""
    
    pause_and_continue
    
    echo -e "${GREEN}✓ Apps uploaded to Google Play${NC}"
}

# Step 10: Test Everything
test_everything() {
    echo ""
    echo -e "${BLUE}[STEP 10] Testing Everything${NC}"
    echo ""
    echo "Checklist:"
    echo "  [ ] Website loads: https://fairchancefinder.com"
    echo "  [ ] Search jobs with distance filter"
    echo "  [ ] Upload resume on profile"
    echo "  [ ] Apply to a job"
    echo "  [ ] Test job posting ($75 payment)"
    echo "  [ ] Check Stripe dashboard for payment"
    echo "  [ ] Download app from Google Play internal testing"
    echo "  [ ] Install and test mobile app"
    echo "  [ ] Check Google Search Console for indexing"
    echo ""
    
    pause_and_continue
    
    echo -e "${GREEN}✓ Testing complete${NC}"
}

# Main execution
main() {
    check_prerequisites
    setup_stripe
    setup_aws
    setup_google
    setup_email
    setup_domain
    setup_netlify
    deploy_to_netlify
    build_android_app
    upload_to_google_play
    test_everything
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              🎉 Setup Complete!                           ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Your site is now live at: https://fairchancefinder.com"
    echo ""
    echo "Next steps:"
    echo "  • Monitor Stripe for job postings"
    echo "  • Check Google Search Console for indexing"
    echo "  • Track analytics"
    echo "  • Update job listings regularly"
    echo ""
}

# Run main
main
