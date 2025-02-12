import { Injectable } from '@angular/core';

interface ImageDimensions {
    width: number;
    height: number;
}

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private readonly imageDimensions = new Map<string, ImageDimensions>([
        ['profile', { width: 400, height: 400 }],
        ['project-preview', { width: 800, height: 450 }],
        ['project-thumbnail', { width: 400, height: 225 }],
        ['og-image', { width: 1200, height: 630 }]
    ]);

    constructor() { }

    getOptimizedImageUrl(originalUrl: string, type: keyof typeof ImageTypes): string {
        // Se l'URL è già ottimizzato o è un'immagine esterna, ritorna l'URL originale
        if (originalUrl.includes('cdn.') || !originalUrl.startsWith('/assets')) {
            return originalUrl;
        }

        const dimensions = this.imageDimensions.get(type);
        if (!dimensions) return originalUrl;

        // Costruisci l'URL ottimizzato (esempio con Cloudinary o simili)
        // Sostituisci con il tuo servizio di ottimizzazione immagini
        return `https://tuo-servizio-cdn.com/image/upload/c_fill,w_${dimensions.width},h_${dimensions.height}${originalUrl}`;
    }

    getImageDimensions(type: keyof typeof ImageTypes): ImageDimensions | undefined {
        return this.imageDimensions.get(type);
    }
}

export enum ImageTypes {
    'profile' = 'profile',
    'project-preview' = 'project-preview',
    'project-thumbnail' = 'project-thumbnail',
    'og-image' = 'og-image'
}
