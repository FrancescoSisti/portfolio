import { Component, OnInit, HostListener, PLATFORM_ID, Inject, OnDestroy, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeMobileComponent } from './home-mobile/home-mobile.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { ResponsiveService } from '../../services/responsive.service';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Project {
  number: string;
  title: string;
  description: string;
  technologies: string[];
  previewUrl?: string;
  githubUrl?: string;
  imageUrl: string;
  imageAlt: string;
}

interface Skill {
  name: string;
  icon: string;
}

interface Stat {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  link: {
    text: string;
    route: string;
  };
  contextIcons: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, HomeMobileComponent],
  providers: [WeatherService, HttpClient],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  private isHydrated = false;
  activeTooltip: number | null = null;
  isMobile = false;
  showScrollMessage: boolean = false;
  private scrollTimeout: any;
  private scrollSubscription: Subscription = new Subscription();
  private clickSubscription: Subscription = new Subscription();
  private initialTimeout: any;
  private map: any;

  skills: Skill[] = [
    { name: 'HTML5', icon: 'fab fa-html5' },
    { name: 'CSS3', icon: 'fab fa-css3-alt' },
    { name: 'JavaScript', icon: 'fab fa-js' },
    { name: 'Angular', icon: 'fab fa-angular' },
    { name: 'PHP', icon: 'fab fa-php' },
    { name: 'Laravel', icon: 'fab fa-laravel' }
  ];

  featuredProjects: Project[] = [
    {
      number: '01',
      title: 'Opus Agency Website',
      description: 'Sito web aziendale moderno con design personalizzato, ottimizzazione SEO e interfaccia utente reattiva. Realizzato completamente da zero con tecnologie all\'avanguardia.',
      technologies: ['Angular', 'TypeScript', 'SCSS', 'SEO'],
      previewUrl: 'https://opusagency.it/',
      imageUrl: '',
      imageAlt: 'Opus Agency Website Preview'
    },
    {
      number: '02',
      title: 'Laravel BDoctors',
      description: 'Piattaforma per la gestione di profili medici con sistema di prenotazione e dashboard amministrativa.',
      technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
      githubUrl: 'https://github.com/FrancescoSisti/laravel-bdoctors',
      imageUrl: '',
      imageAlt: 'Laravel BDoctors Platform Preview'
    }
  ];

  socialLinks = [
    {
      url: 'https://github.com/sisisisisisisi',
      icon: 'fab fa-github',
      label: 'GitHub'
    },
    {
      url: 'https://www.linkedin.com/in/francesco-sisti-dev/',
      icon: 'fab fa-linkedin-in',
      label: 'LinkedIn'
    },
    {
      url: 'https://www.instagram.com/sisisisisisisi.dev/',
      icon: 'fab fa-instagram',
      label: 'Instagram'
    }
  ];

  stats: Stat[] = [
    {
      title: 'Sviluppo Web',
      subtitle: 'Full Stack',
      icon: 'fas fa-code',
      color: '#6366f1',
      link: {
        text: 'Le mie competenze',
        route: '/about'
      },
      contextIcons: ['fas fa-code-branch', 'fas fa-sitemap', 'fas fa-diagram-project', 'fas fa-database', 'fas fa-server']
    },
    {
      title: 'UI/UX Design',
      subtitle: 'Design Moderno',
      icon: 'fas fa-wand-magic-sparkles',
      color: '#ec4899',
      link: {
        text: 'I miei progetti',
        route: '/projects'
      },
      contextIcons: ['fas fa-palette', 'fas fa-pen-ruler', 'fas fa-swatchbook', 'fas fa-vector-square', 'fas fa-bezier-curve']
    },
    {
      title: 'Performance',
      subtitle: 'Ottimizzazione',
      icon: 'fas fa-gauge-high',
      color: '#14b8a6',
      link: {
        text: 'Scopri di più',
        route: '/about#skills'
      },
      contextIcons: ['fas fa-bolt', 'fas fa-rocket', 'fas fa-tachometer-alt', 'fas fa-chart-line', 'fas fa-code-branch']
    }
  ];

  constructor(
    private weatherService: WeatherService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private responsiveService: ResponsiveService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkHydration();
    }
  }

  private async checkHydration() {
    this.ngZone.runOutsideAngular(async () => {
      try {
        await firstValueFrom(this.appRef.isStable);
        this.ngZone.run(() => {
          this.isHydrated = true;
          this.initBrowserFeatures();
        });
      } catch (error) {
        console.error('Error during hydration:', error);
      }
    });
  }

  async ngOnInit() {
    this.isMobile = this.responsiveService.isMobile;

    if (!this.isMobile) {
      // Mostra il messaggio dopo 12 secondi se l'utente non ha scrollato o cliccato
      this.initialTimeout = setTimeout(() => {
        if (window.scrollY === 0) {
          this.showScrollMessage = true;
        }
      }, 12000);

      // Gestisce lo scroll
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(debounceTime(50))
        .subscribe(() => {
          this.showScrollMessage = false;
          if (this.initialTimeout) {
            clearTimeout(this.initialTimeout);
          }
        });

      // Gestisce i click
      this.clickSubscription = fromEvent(document, 'click')
        .pipe(debounceTime(50))
        .subscribe(() => {
          this.showScrollMessage = false;
          if (this.initialTimeout) {
            clearTimeout(this.initialTimeout);
          }
        });
    }

    // Lazy load Leaflet only when needed
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    if (this.isElementInViewport(mapElement)) {
      await this.initializeMap();
    } else {
      const observer = new IntersectionObserver(
        async (entries) => {
          if (entries[0].isIntersecting) {
            await this.initializeMap();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(mapElement);
    }
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
    if (this.initialTimeout) {
      clearTimeout(this.initialTimeout);
    }
  }

  scrollToContent() {
    if (!this.isHydrated) return;

    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        const featuredWork = document.getElementById('featured-work');
        if (featuredWork) {
          featuredWork.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  private initBrowserFeatures() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initScrollAnimations();
        this.lazyLoadImages();
      });
    }
  }

  private initScrollAnimations() {
    if (!this.isHydrated) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.ngZone.run(() => {
            entry.target.classList.add('animate-in');
          });
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  private lazyLoadImages() {
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-src]').forEach(img => {
        if (img instanceof HTMLImageElement) {
          img.src = img.dataset['src'] || '';
          img.removeAttribute('data-src');
        }
      });
    } else {
      // Fallback per browser che non supportano lazy loading nativo
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = img.dataset['src'] || '';
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.isHydrated) return;

    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
          if (window.scrollY > 100) {
            scrollIndicator.classList.add('fade-out');
          } else {
            scrollIndicator.classList.remove('fade-out');
          }
        }
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
      if (this.isMobile) {
        this.activeTooltip = null;
      }
    }
  }

  private async initializeMap() {
    try {
      const L = await import('leaflet');
      this.map = L.map('map').setView([45.4384, 10.9916], 13); // Verona coordinates

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      L.marker([45.4384, 10.9916]).addTo(this.map)
        .bindPopup('Verona, Italy')
        .openPopup();
    } catch (error) {
      console.error('Error loading map:', error);
    }
  }

  private isElementInViewport(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

