import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    constructor(
        private meta: Meta,
        private title: Title,
        private router: Router
    ) {
        // Listen to route changes to update meta tags
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            const route = this.router.routerState.root.firstChild;
            if (route?.snapshot.data) {
                this.updateMetaTags(
                    route.snapshot.title || '',
                    route.snapshot.data['description'] || ''
                );
            }
        });
    }

    private updateMetaTags(title: string, description: string): void {
        // Update basic meta tags
        this.title.setTitle(title);
        this.meta.updateTag({ name: 'description', content: description });

        // Update Open Graph meta tags
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:url', content: window.location.href });

        // Update Twitter Card meta tags
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
    }

    public setCanonicalUrl(url?: string): void {
        const canURL = url || window.location.href;
        const link: HTMLLinkElement = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', canURL);

        const existingLink = document.head.querySelector('link[rel="canonical"]');
        if (existingLink) {
            document.head.removeChild(existingLink);
        }
        document.head.appendChild(link);
    }

    public setBreadcrumbSchema(breadcrumbs: Array<{ name: string, url: string }>): void {
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': breadcrumb.name,
                'item': `https://francescosisti.com${breadcrumb.url}`
            }))
        };

        // Rimuovi eventuali breadcrumb schema esistenti
        const existingScript = document.head.querySelector('script[data-breadcrumbs]');
        if (existingScript) {
            document.head.removeChild(existingScript);
        }

        // Aggiungi il nuovo schema
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-breadcrumbs', '');
        script.text = JSON.stringify(schema);
        document.head.appendChild(script);
    }

    public updateMetaImage(imageUrl: string): void {
        // Aggiorna Open Graph image
        this.meta.updateTag({ property: 'og:image', content: imageUrl });
        // Aggiorna Twitter image
        this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    }
}
