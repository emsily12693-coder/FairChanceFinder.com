# 🚀 FairChance Finder - Quick Start Guide

## Start Here (Just 3 Commands!)

### 1. Run Setup Script (Choose One)

**Option A: Interactive Setup (Recommended)**
```bash
chmod +x setup-interactive.sh
./setup-interactive.sh
```
This will guide you through everything step-by-step!

**Option B: Manual Setup**
```bash
chmod +x setup-init.sh
./setup-init.sh
cp .env.example .env.local
nano .env.local  # Edit with your credentials
```

---

## 📋 What You'll Set Up

| Service | Purpose | Time |
|---------|---------|------|
| **Stripe** | Process $75 job posting payments | 5 min |
| **AWS** | Store resumes & job data | 10 min |
| **Gmail/SendGrid** | Send confirmation emails | 3 min |
| **Google Play** | Publish mobile app | 5 min |
| **Netlify** | Host website (already done) | 2 min |
| **Namecheap** | Point domain (wait 24-48 hrs) | 5 min |

**Total Setup Time: ~30 minutes**

---

## 🔑 Quick Credentials Checklist

Gather these before starting:

```
[ ] Stripe Publishable Key (pk_...)
[ ] Stripe Secret Key (sk_...)
[ ] AWS Access Key ID
[ ] AWS Secret Access Key
[ ] Gmail App Password (or SendGrid API Key)
[ ] Google Play Developer Account
[ ] Namecheap Domain Login
```

---

## 📱 Pre-Built Files Ready to Use

✅ **Android App - 3 Versions:**
- `fcf-v1.0.0-basic.aab` - Basic features
- `fcf-v1.0.1-payments.aab` - With Stripe payments
- `fcf-v1.0.2-complete.aab` - All features + analytics

✅ **Configuration Files:**
- `.env.example` - Environment template
- `netlify.toml` - Netlify deployment config
- `manifest.json` - Progressive Web App config
- `AndroidManifest.xml` - Android app config

✅ **Backend Functions:**
- `create-payment-intent.js` - Stripe payment processing
- `stripe-webhook.js` - ACH deposits to your bank
- `upload-resume.js` - Resume storage
- `get-jobs.js` - Job search & filtering
- `send-application.js` - Email to employers

---

## 🎯 Fastest Path to Launch

### Day 1 (Setup - 30 min)
```bash
1. Create Stripe account: https://stripe.com (5 min)
2. Create AWS account: https://aws.amazon.com (10 min)
3. Run: ./setup-interactive.sh (10 min)
4. Deploy: git push origin main (5 min)
```

### Day 2 (Verify - 10 min)
```bash
1. Check: https://fairchancefinder.com loads
2. Test job search & resume upload
3. Test $75 payment flow (use: 4242 4242 4242 4242)
```

### Day 3-7 (Domain Propagation)
```bash
Wait for DNS to propagate (24-48 hours)
- Changes in Namecheap take time
- Check: https://mxtoolbox.com/dnsrecordlookup
```

### Week 2 (Mobile App)
```bash
1. Build Android app: flutter build appbundle --release
2. Upload to Google Play: 3 AAB files
3. Invite testers
```

---

## 🆘 Troubleshooting

### "Website won't load"
```
→ DNS not yet propagated (wait 24-48 hours)
→ Or: Check Netlify deployment status
```

### "Payment not working"
```
→ Verify Stripe keys in .env.local
→ Check: https://dashboard.stripe.com
```

### "Emails not sending"
```
→ Use Gmail app password (not main password)
→ Check spam folder
→ Verify email address in .env.local
```

### "Jobs not showing"
```
→ Check AWS DynamoDB table exists
→ Verify AWS credentials in .env.local
→ Check Netlify function logs
```

---

## ✅ Launch Checklist

**Before Going Public:**
- [ ] Website loads at fairchancefinder.com
- [ ] Search jobs works
- [ ] Resume upload works
- [ ] Job posting with payment works
- [ ] Stripe shows transactions
- [ ] Employer receives confirmation email
- [ ] Job appears on site
- [ ] Mobile app installed from Google Play
- [ ] Google Search Console shows indexing
- [ ] All links work correctly

---

## 📊 Features Included

### 🔍 Job Seeker Features
- ✅ Search jobs within 100 miles of Phoenix
- ✅ Filter by category, type, salary
- ✅ Save favorite jobs
- ✅ Upload & manage resume
- ✅ Apply directly through platform
- ✅ Track application history
- ✅ Mobile app access

### 💼 Employer Features
- ✅ Post jobs for $75/listing (30 days)
- ✅ View all applications
- ✅ Direct messaging with applicants
- ✅ Performance analytics
- ✅ Auto ACH deposit to bank account

### ⚙️ Admin Features
- ✅ Manage all job listings
- ✅ View payment transactions
- ✅ See all applications
- ✅ Platform analytics
- ✅ User management

---

## 🔗 Important Links

| What | Where | Purpose |
|------|-------|---------|
| Setup | `./setup-interactive.sh` | Complete automated setup |
| Credentials | `.env.local` | Your API keys (keep secret!) |
| Deployment | GitHub → Netlify | Auto-deploys on push |
| Domain | Namecheap → Netlify | Point your domain |
| Payment | Stripe Dashboard | Monitor transactions |
| Storage | AWS Console | Manage uploads |
| Mobile | Google Play Console | Publish app |
| Site | https://fairchancefinder.com | Your live website |

---

## 📞 Support

**Questions?**
- Check logs: `netlify logs` (in terminal)
- Email: EPCSR@fairchancefinder.com
- Review: SETUP_GUIDE.md in repo

**Issues?**
- Stripe not working: https://dashboard.stripe.com
- AWS not working: AWS CloudWatch logs
- Email not working: Check spam folder
- Domain not working: DNS takes 24-48 hours

---

## 🎉 You're Ready!

**Everything is built and ready to go.**

Just run one command and you'll have a fully functional job board with:
- ✅ Job search by location
- ✅ Resume uploads
- ✅ Job applications
- ✅ Employer job postings ($75)
- ✅ Payment processing
- ✅ Mobile app
- ✅ Email notifications

**Let's go! 🚀**

```bash
chmod +x setup-interactive.sh
./setup-interactive.sh
```
