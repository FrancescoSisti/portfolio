import { Injectable, OnDestroy } from '@angular/core';

// Dichiarazione del tipo gtag
declare global {
    interface Window {
        gtag: (command: string, ...args: any[]) => void;
        dataLayer: any[];
    }
}

@Injectable({
    providedIn: 'root'
})
export class PerformanceService implements OnDestroy {
    // PERFORMANCE FIX: Store observers to clean them up later
    private observers: PerformanceObserver[] = [];

    constructor() {
        this.initPerformanceMonitoring();
    }

    // PERFORMANCE FIX: Implement cleanup to prevent memory leaks
    ngOnDestroy(): void {
        this.cleanup();
    }

    private cleanup(): void {
        // Disconnect all observers to prevent memory leaks
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('Error disconnecting performance observer:', error);
            }
        });
        this.observers = [];
    }

    private initPerformanceMonitoring() {
        if (typeof window !== 'undefined') {
            // Monitora FCP (First Contentful Paint)
            this.observeFCP();

            // Monitora LCP (Largest Contentful Paint)
            this.observeLCP();

            // Monitora CLS (Cumulative Layout Shift)
            this.observeCLS();

            // Monitora FID (First Input Delay)
            this.observeFID();
        }
    }

    private observeFCP() {
        const entryHandler = (list: PerformanceObserverEntryList) => {
            for (const entry of list.getEntries()) {
                const metric = entry as PerformanceEntry;
                console.log('FCP:', metric.startTime);
                this.sendToAnalytics('FCP', metric.startTime);
            }
        };

        const po = new PerformanceObserver(entryHandler);
        // PERFORMANCE FIX: Store observer for later cleanup
        this.observers.push(po);
        po.observe({ type: 'paint', buffered: true });
    }

    private observeLCP() {
        const entryHandler = (list: PerformanceObserverEntryList) => {
            for (const entry of list.getEntries()) {
                const metric = entry as PerformanceEntry;
                console.log('LCP:', metric.startTime);
                this.sendToAnalytics('LCP', metric.startTime);
            }
        };

        const po = new PerformanceObserver(entryHandler);
        // PERFORMANCE FIX: Store observer for later cleanup
        this.observers.push(po);
        po.observe({ type: 'largest-contentful-paint', buffered: true });
    }

    private observeCLS() {
        let clsValue = 0;
        let clsEntries: any[] = [];

        const entryHandler = (list: PerformanceObserverEntryList) => {
            for (const entry of list.getEntries()) {
                if (!(entry as any).hadRecentInput) {
                    const firstSessionEntry = clsEntries.length === 0;
                    const largestSessionValue = clsEntries.reduce((max, curr) => (curr.value > max ? curr.value : max), 0);

                    if (firstSessionEntry || (entry as any).value > largestSessionValue) {
                        clsEntries.push(entry);
                    }

                    if (clsEntries.length > 5) {
                        clsEntries = clsEntries.slice(-5);
                    }

                    clsValue = clsEntries.reduce((sum, entry) => sum + entry.value, 0);
                    console.log('CLS:', clsValue);
                    this.sendToAnalytics('CLS', clsValue);
                }
            }
        };

        const po = new PerformanceObserver(entryHandler);
        // PERFORMANCE FIX: Store observer for later cleanup
        this.observers.push(po);
        po.observe({ type: 'layout-shift', buffered: true });
    }

    private observeFID() {
        const entryHandler = (list: PerformanceObserverEntryList) => {
            for (const entry of list.getEntries()) {
                const metric = entry as PerformanceEntry;
                console.log('FID:', metric.startTime);
                this.sendToAnalytics('FID', metric.startTime);
            }
        };

        const po = new PerformanceObserver(entryHandler);
        // PERFORMANCE FIX: Store observer for later cleanup
        this.observers.push(po);
        po.observe({ type: 'first-input', buffered: true });
    }

    private sendToAnalytics(metricName: string, value: number) {
        if (typeof window.gtag !== 'undefined') {
            window.gtag('event', 'web_vital', {
                event_category: 'Web Vitals',
                event_label: metricName,
                value: Math.round(value),
                non_interaction: true,
            });
        }
    }
}
