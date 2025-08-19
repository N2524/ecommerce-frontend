/**
 * Image Optimization Script
 * Handles lazy loading, responsive images, and format optimization
 */

class ImageOptimizer {
    constructor() {
        this.observer = null;
        this.supportsWebP = false;
        this.init();
    }

    init() {
        this.checkWebPSupport();
        this.setupLazyLoading();
        this.optimizeExistingImages();
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    setupLazyLoading() {
        // Native lazy loading support check
        if ('loading' in HTMLImageElement.prototype) {
            this.enableNativeLazyLoading();
        } else {
            this.enableJavaScriptLazyLoading();
        }
    }

    enableNativeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.srcset = img.dataset.srcset || '';
            img.sizes = img.dataset.sizes || '';
            img.loading = 'lazy';
        });
    }

    enableJavaScriptLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.srcset = img.dataset.srcset || '';
                    img.sizes = img.dataset.sizes || '';
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    optimizeExistingImages() {
        // Convert existing images to use responsive attributes
        const images = document.querySelectorAll('img:not([data-optimized])');
        
        images.forEach(img => {
            if (img.src.includes('assets/images/')) {
                this.optimizeImage(img);
            }
        });
    }

    optimizeImage(img) {
        const originalSrc = img.src;
        const filename = originalSrc.split('/').pop().split('.')[0];
        
        // Create responsive image attributes
        img.setAttribute('data-optimized', 'true');
        
        // WebP with fallback
        if (this.supportsWebP) {
            img.setAttribute('data-src', `assets/images/optimized/${filename}.webp`);
            img.setAttribute('onerror', `this.onerror=null; this.src='assets/images/optimized/${filename}.jpg'`);
        } else {
            img.setAttribute('data-src', `assets/images/optimized/${filename}.jpg`);
        }

        // Add responsive attributes
        img.setAttribute('data-srcset', this.generateSrcset(filename));
        img.setAttribute('data-sizes', '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px');
        
        // Add lazy loading
        img.classList.add('lazy');
        img.setAttribute('loading', 'lazy');
    }

    generateSrcset(filename) {
        const sizes = [300, 600, 900, 1200];
        const extension = this.supportsWebP ? 'webp' : 'jpg';
        
        return sizes.map(size => 
            `assets/images/responsive/${filename}-${size}w.${extension} ${size}w`
        ).join(', ');
    }

    // Utility method to preload critical images
    preloadImage(src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();
});

// Export for use in other modules
window.ImageOptimizer = ImageOptimizer;
