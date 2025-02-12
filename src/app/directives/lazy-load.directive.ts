import { Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appLazyLoad]',
    standalone: true
})
export class LazyLoadDirective implements OnInit {
    @HostBinding('attr.src') srcAttr: string | null = null;
    @Input() appLazyLoadSrc: string = '';

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
    }

    private canLazyLoad() {
        return window && 'IntersectionObserver' in window;
    }

    private lazyLoadImage() {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(({ isIntersecting }) => {
                if (isIntersecting) {
                    this.loadImage();
                    obs.unobserve(this.el.nativeElement);
                }
            });
        });
        obs.observe(this.el.nativeElement);
    }

    private loadImage() {
        this.srcAttr = this.appLazyLoadSrc;
    }
}
