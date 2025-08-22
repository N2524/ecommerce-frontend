# Netlify Deployment Guide

## Quick Netlify Setup

### 1. Connect GitHub Repository
1. Go to [Netlify.com](https://netlify.com) and sign up
2. Click "New site from Git"
3. Choose "GitHub" as your provider
4. Select your `ecommerce-frontend` repository

### 2. Configure Build Settings
- **Build command**: (leave empty for static sites)
- **Publish directory**: (leave as `/` or enter `.`)
- **Base directory**: (leave empty)

### 3. Deploy
- Click "Deploy site"
- Netlify will automatically deploy your site
- You'll get a URL like `https://amazing-name-123456.netlify.app`

### 4. Custom Domain (Optional)
- Go to Site settings → Domain management
- Add custom domain or use Netlify subdomain

## Netlify Features Available
- ✅ Continuous deployment from GitHub
- ✅ Form handling (for contact forms)
- ✅ Serverless functions (for backend features)
- ✅ SSL certificate (automatic)
- ✅ CDN for fast global delivery

## Environment Variables (if needed)
If you add backend integration later:
- Go to Site settings → Environment variables
- Add API keys, database URLs, etc.

## Build Settings Reference
```
Build command: (none for static)
Publish directory: .
Base directory: (empty)
```

## Deploy Previews
Every pull request will get a unique preview URL automatically.
