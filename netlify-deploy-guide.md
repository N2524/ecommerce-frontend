# Netlify Deployment Guide for E-Commerce Frontend

## Quick Deployment Steps

### 1. Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `echo "No build required"`
   - **Publish directory**: `.`

### 2. Environment Variables
Add these in Netlify dashboard > Site settings > Environment variables:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 3. Deploy Options

#### Option A: GitHub Integration (Recommended)
- Automatic deployments on every push
- Branch previews for testing
- Rollback capability

#### Option B: Manual Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=.
```

### 4. Custom Domain Setup
1. Go to Domain settings in Netlify
2. Add custom domain
3. Update DNS records with your domain provider
4. SSL certificate automatically provided

### 5. Performance Optimization
- **Asset optimization**: Enabled by default
- **Image optimization**: Automatic CDN delivery
- **Compression**: Gzip/Brotli enabled
- **Caching**: Configured in netlify.toml

### 6. Form Handling (Optional)
For contact forms:
1. Add `netlify` attribute to forms
2. Configure form notifications
3. Set up spam protection

### 7. Monitoring
- **Analytics**: Built-in site analytics
- **Performance**: Lighthouse CI integration
- **Uptime**: 99.9% uptime SLA

## File Structure Created
- `netlify.toml` - Main configuration
- `_redirects` - SPA routing rules
- `.gitignore` - Updated for Netlify
- `netlify-deploy-guide.md` - This guide

## Next Steps
1. Review configuration files
2. Test deployment locally
3. Connect to GitHub
4. Configure environment variables
5. Deploy to production
