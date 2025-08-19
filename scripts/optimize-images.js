#!/usr/bin/env node
/**
 * Batch Image Optimization Script
 * Compresses and converts images to modern formats (WebP, AVIF)
 * Generates responsive image variants
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class ImageProcessor {
    constructor() {
        this.inputDir = 'assets/images';
        this.outputDir = 'assets/images/optimized';
        this.responsiveDir = 'assets/images/responsive';
        this.config = {
            formats: ['webp', 'jpg', 'png'],
            widths: [300, 600, 900, 1200],
            quality: {
                webp: 80,
                jpeg: 85,
                png: 90
            }
        };
    }

    async init() {
        console.log('🚀 Starting image optimization...');
        
        // Create output directories
        await this.createDirectories();
        
        // Process all images
        await this.processAllImages();
        
        console.log('✅ Image optimization complete!');
    }

    async createDirectories() {
        const dirs = [this.outputDir, this.responsiveDir];
        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Created directory: ${dir}`);
            }
        }
    }

    async processAllImages() {
        const imageFiles = this.getImageFiles();
        
        for (const file of imageFiles) {
            console.log(`🖼️  Processing: ${file}`);
            await this.processImage(file);
        }
    }

    getImageFiles() {
        const files = fs.readdirSync(this.inputDir);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff'];
        
        return files.filter(file => 
            imageExtensions.includes(path.extname(file).toLowerCase())
        );
    }

    async processImage(filename) {
        const inputPath = path.join(this.inputDir, filename);
        const nameWithoutExt = path.basename(filename, path.extname(filename));
        
        // Generate optimized versions
        await this.generateOptimizedFormats(inputPath, nameWithoutExt);
        
        // Generate responsive variants
        await this.generateResponsiveVariants(inputPath, nameWithoutExt);
    }

    async generateOptimizedFormats(inputPath, nameWithoutExt) {
        const image = sharp(inputPath);
        
        // WebP format
        await image
            .webp({ quality: this.config.quality.webp })
            .toFile(path.join(this.outputDir, `${nameWithoutExt}.webp`));
        
        // JPEG format
        await image
            .jpeg({ 
                quality: this.config.quality.jpeg, 
                progressive: true 
            })
            .toFile(path.join(this.outputDir, `${nameWithoutExt}.jpg`));
        
        // PNG format (if original is PNG)
        if (path.extname(inputPath).toLowerCase() === '.png') {
            await image
                .png({ 
                    quality: this.config.quality.png,
                    compressionLevel: 9
                })
                .toFile(path.join(this.outputDir, `${nameWithoutExt}.png`));
        }
    }

    async generateResponsiveVariants(inputPath, nameWithoutExt) {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        for (const width of this.config.widths) {
            if (metadata.width >= width) {
                // WebP responsive
                await image
                    .resize(width, null, { withoutEnlargement: true })
                    .webp({ quality: this.config.quality.webp })
                    .toFile(path.join(this.responsiveDir, `${nameWithoutExt}-${width}w.webp`));
                
                // JPEG responsive
                await image
                    .resize(width, null, { withoutEnlargement: true })
                    .jpeg({ quality: this.config.quality.jpeg })
                    .toFile(path.join(this.responsiveDir, `${nameWithoutExt}-${width}w.jpg`));
            }
        }
    }

    // Generate srcset strings for responsive images
    generateSrcset(filename) {
        const nameWithoutExt = path.basename(filename, path.extname(filename));
        const widths = this.config.widths;
        
        const webpSrcset = widths.map(width => 
            `assets/images/responsive/${nameWithoutExt}-${width}w.webp ${width}w`
        ).join(', ');
        
        const jpgSrcset = widths.map(width => 
            `assets/images/responsive/${nameWithoutExt}-${width}w.jpg ${width}w`
        ).join(', ');
        
        return { webp: webpSrcset, jpg: jpgSrcset };
    }

    // Generate picture element HTML
    generatePictureElement(filename, alt, options = {}) {
        const nameWithoutExt = path.basename(filename, path.extname(filename));
        const srcset = this.generateSrcset(filename);
        
        return `
<picture>
    <source type="image/webp" 
            srcset="${srcset.webp}" 
            sizes="${options.sizes || '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px'}">
    <source type="image/jpeg" 
            srcset="${srcset.jpg}" 
            sizes="${options.sizes || '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px'}">
    <img src="assets/images/optimized/${nameWithoutExt}.jpg" 
         alt="${alt}" 
         width="${options.width || 400}" 
         height="${options.height || 300}"
         loading="${options.loading || 'lazy'}"
         decoding="async"
         class="${options.className || 'responsive-image'}">
</picture>`.trim();
    }
}

// CLI execution
if (require.main === module) {
    const processor = new ImageProcessor();
    processor.init().catch(console.error);
}

module.exports = ImageProcessor;
