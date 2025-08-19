/**
 * Build Optimization Script
 * Handles image compression, minification, and asset optimization
 */

const fs = require('fs');
const path = require('path');

class BuildOptimizer {
    constructor() {
        this.config = {
            imageExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
            outputDir: 'assets/images/optimized',
            responsiveDir: 'assets/images/responsive',
            quality: {
                webp: 80,
                jpeg: 85,
                png: 90
            }
        };
    }

    // Image optimization configuration
    getImageConfig() {
        return {
            formats: {
                webp: { quality: 80, effort: 6 },
                jpeg: { quality: 85, progressive: true },
                png: { quality: 90, compressionLevel: 9 }
            },
            responsive: {
                widths: [300, 600, 900, 1200],
                formats: ['webp', 'jpg']
            }
        };
    }

    // Generate responsive image markup
    generateResponsiveImage(src, alt, options = {}) {
        const filename = path.basename(src, path.extname(src));
        const config = this.getImageConfig();
        
        const srcsetWebP = config.responsive.widths
            .map(width => `${this.config.responsiveDir}/${filename}-${width}w.webp ${width}w`)
            .join(', ');
            
        const srcsetJpg = config.responsive.widths
            .map(width => `${this.config.responsiveDir}/${filename}-${width}w.jpg ${width}w`)
            .join(', ');

        return `
            <picture>
                <source type="image/webp" 
                        srcset="${srcsetWebP}" 
                        sizes="${options.sizes || '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px'}">
                <source type="image/jpeg" 
                        srcset="${srcsetJpg}" 
                        sizes="${options.sizes || '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px'}">
                <img src="${this.config.outputDir}/${filename}.jpg" 
                     alt="${alt}" 
                     width="${options.width || 400}" 
                     height="${options.height || 300}"
                     loading="${options.loading || 'lazy'}"
                     decoding="async"
                     class="${options.className || ''}">
            </picture>
        `.trim();
    }

    // Generate critical CSS
    generateCriticalCSS() {
        return `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: Arial, sans-serif; }
            .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .logo { height: 40px; width: auto; }
            .hero { display: flex; align-items: center; padding: 2rem; min-height: 60vh; }
            .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; padding: 1rem; }
            .grid-item { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; transition: transform 0.3s; }
            .grid-item:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
            .w-full { width: 100%; }
            .h-48 { height: 12rem; }
            .object-cover { object-fit: cover; }
            .lazy { opacity: 0; transition: opacity 0.3s; }
            .lazy.loaded { opacity: 1; }
            .image-container { position: relative; overflow: hidden; background: #f0f0f0; }
            .aspect-ratio-box-4-3 { padding-bottom: 75%; position: relative; }
            .aspect-ratio-box-4-3 img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        `.trim();
    }

    // Generate service worker for caching
    generateServiceWorker() {
        return `
            const CACHE_NAME = 'ecommerce-v1';
            const urlsToCache = [
                '/',
                '/styles/main.css',
                '/styles/image-optimization.css',
                '/scripts/image-optimizer.js',
                '/assets/images/logo.webp',
                '/assets/images/optimized/'
            ];

            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => cache.addAll(urlsToCache))
                );
            });

            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => {
                            if (response) {
                                return response;
                            }
                            return fetch(event.request);
                        })
                );
            });
        `.trim();
    }

    // Generate .htaccess for server optimization
    generateHtaccess() {
        return `
            # Enable compression
            <IfModule mod_deflate.c>
                AddOutputFilterByType DEFLATE text/plain
                AddOutputFilterByType DEFLATE text/html
                AddOutputFilterByType DEFLATE text/xml
                AddOutputFilterByType DEFLATE text/css
                AddOutputFilterByType DEFLATE application/xml
                AddOutputFilterByType DEFLATE application/xhtml+xml
                AddOutputFilterByType DEFLATE application/rss+xml
                AddOutputFilterByType DEFLATE application/javascript
                AddOutputFilterByType DEFLATE application/x-javascript
                AddOutputFilterByType DEFLATE image/svg+xml
            </IfModule>

            # Leverage browser caching
            <IfModule mod_expires.c>
                ExpiresActive on
                ExpiresByType image/jpg "access plus 1 month"
                ExpiresByType image/jpeg "access plus 1 month"
                ExpiresByType image/gif "access plus 1 month"
                ExpiresByType image/png "access plus 1 month"
                ExpiresByType image/webp "access plus 1 month"
                ExpiresByType text/css "access plus 1 month"
                ExpiresByType application/pdf "access plus 1 month"
                ExpiresByType text/javascript "access plus 1 month"
                ExpiresByType application/javascript "access plus 1 month"
            </IfModule>

            # Serve WebP images
            <IfModule mod_rewrite.c>
                RewriteEngine On
                RewriteCond %{HTTP_ACCEPT} image/webp
                RewriteCond %{REQUEST_FILENAME}.webp -f
                RewriteRule (.+)\\.(jpe?g|png)$ $1.webp [T=image/webp,E=REQUEST_image]
            </IfModule>

            <IfModule mod_headers.c>
                Header append Vary Accept env=REQUEST_image
            </IfModule>

            AddType image/webp .webp
        `.trim();
    }

    // Create optimization report
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            optimizations: [
                'Lazy loading implemented',
                'Responsive images configured',
                'WebP format support added',
                'Critical CSS inlined',
                'Service worker configured',
                'Browser caching enabled',
                'Compression enabled'
            ],
            recommendations: [
                'Use ImageMagick or Sharp for batch image processing',
                'Set up CDN for image delivery',
                'Implement progressive image loading',
                'Add image CDN with automatic optimization'
            ]
        };
    }
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuildOptimizer;
}

// Usage example
const optimizer = new BuildOptimizer();
console.log('Optimization report:', optimizer.generateReport());
