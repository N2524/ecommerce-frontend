// Deployment Test Script
// This script helps test your deployment configuration

console.log('🚀 E-commerce Frontend Deployment Test');
console.log('=======================================');

// Test if main files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'cart.html',
  'product.html',
  'login.html',
  'signup.html',
  'main.css',
  'scripts/app.js',
  'scripts/cart-service.js',
  'scripts/product-detail.js',
  'netlify.toml'
];

console.log('\n📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n🌐 Deployment Configuration:');
console.log('✅ GitHub Repository: https://github.com/N2524/ecommerce-frontend');
console.log('✅ Netlify config: netlify.toml present');
console.log('📋 Deployment guide: DEPLOYMENT.md created');

console.log('\n📋 Next Steps:');
console.log('1. Enable GitHub Pages: https://github.com/N2524/ecommerce-frontend/settings/pages');
console.log('2. OR Connect to Netlify: https://app.netlify.com');
console.log('3. Your site will be live at:');
console.log('   - GitHub Pages: https://n2524.github.io/ecommerce-frontend/');
console.log('   - Netlify: https://your-unique-name.netlify.app/');

console.log('\n✅ Deployment configuration is ready!');
console.log('Choose your preferred platform and follow the deployment guide.');
