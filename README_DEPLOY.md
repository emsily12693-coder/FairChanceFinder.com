Deployment and verification instructions for FairChanceFinder.com

This file explains how to deploy the site to Netlify, configure Namecheap DNS for the custom domain (fairchancefinder.com), and verify the domain for Android App Links in Google Play Console via a hosted Digital Asset Links file (assetlinks.json).

Files added in this branch (fix/deploy-config)
- .well-known/assetlinks.json  -> placeholder file; replace PACKAGE_NAME and SHA256_CERT_FINGERPRINT
- robots.txt                  -> basic robots file pointing to sitemap.xml
- sitemap.xml                 -> basic sitemap listing main pages
- package.json                -> updated to include a harmless build script

1) package.json change
- I added a safe build script so CI/CD services that expect a build command won't fail:

  "scripts": {
    "build": "echo \"no build step for this static site\""
  }

No other dependencies were changed.

2) Netlify: connect the repo and deploy
- In Netlify, click "New site from Git" -> GitHub -> select repository emsily12693-coder/FairChanceFinder.com
- Branch to deploy: fix/deploy-config (you can switch to main after merging)
- Build command: leave blank OR use "npm run build"
- Publish directory: .
- Create the site. Netlify will assign a temporary site name (your-site-name.netlify.app).
- In the Netlify dashboard -> Domain settings -> Add custom domain -> fairchancefinder.com
- Follow Netlify's DNS instructions. You can either use Netlify DNS (change nameservers at Namecheap) or keep Namecheap DNS and add the DNS records Netlify provides (CNAME for www and A/ALIAS for apex).
- After DNS propagates, Netlify will provision TLS. Enable "Enforce HTTPS".

3) Namecheap DNS (if you keep Namecheap DNS)
- Log in to Namecheap -> Domain List -> Manage next to fairchancefinder.com -> Advanced DNS
- Add the records Netlify gave you. Typical setup if not using Netlify DNS:
  - CNAME: Host = www, Value = <your-site>.netlify.app, TTL = Automatic
  - Apex: add the A records Netlify provided OR use an ALIAS/ANAME if supported
  - Alternatively, set up a redirect from apex (fairchancefinder.com) to www and make www primary
- Save and wait for propagation.

4) Host Digital Asset Links for Google Play (App Links)
- Obtain two pieces of information:
  - Your Android app package name (example: com.example.fairchance)
  - The SHA-256 signing-certificate fingerprint for the certificate that signs the app you will upload to Play:
    * If you sign app locally (keystore):
      keytool -list -v -keystore /path/to/keystore.jks -alias YOUR_ALIAS -storepass YOUR_STOREPASS
      Copy the SHA256: line (format: AA:BB:CC:...)
    * If you use Google Play App Signing, in Play Console -> Setup -> App integrity (or App signing) -> copy the SHA-256 fingerprint from the App signing certificate section
- Edit .well-known/assetlinks.json and replace PACKAGE_NAME and SHA256_CERT_FINGERPRINT with your values.

Example assetlinks.json (already added with placeholders):
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "PACKAGE_NAME",
      "sha256_cert_fingerprints": ["SHA256_CERT_FINGERPRINT"]
    }
  }
]

- Ensure the file is reachable at:
  https://fairchancefinder.com/.well-known/assetlinks.json

- Test with curl:
  curl -I https://fairchancefinder.com/.well-known/assetlinks.json

- In Google Play Console for your app: go to the section for App integrity / Digital Asset Links / Links (UI may vary) and add/verify your website. Play Console will check the hosted assetlinks.json and report verification success/failure.

Notes and next steps
- I kept assetlinks.json with placeholders to avoid committing any private signing fingerprints. Replace placeholders with your real values, commit, and the file will be live at the required path.
- If you prefer verification via Search Console DNS TXT or HTML file, I can add a placeholder HTML verification file or meta tag — tell me which method you prefer.
- Tell me whether you want me to open a PR (I can prepare a PR description) or if you'd like to review changes first. This branch is already created and I'll push these files now.

If you need help extracting the SHA-256 fingerprint or with any of the Netlify/Namecheap steps, reply and I will guide you through the exact commands and UI clicks.
