import { Component, OnInit, HostListener, PLATFORM_ID, Inject, OnDestroy, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';

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
  value: number;
  symbol: string;
  label: string;
  details: {
    title: string;
    description: string;
    items?: string[];
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, NgOptimizedImage],
  providers: [WeatherService, HttpClient]
})
export class HomeComponent implements OnInit, OnDestroy {
  private isHydrated = false;
  activeTooltip: number | null = null;
  isMobile = false;

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
      imageUrl: 'https://placehold.co/800x600/2a2a2a/e6e6e6?text=Opus+Agency',
      imageAlt: 'Opus Agency Website Preview'
    },
    {
      number: '02',
      title: 'Laravel BDoctors',
      description: 'Piattaforma per la gestione di profili medici con sistema di prenotazione e dashboard amministrativa.',
      technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
      githubUrl: 'https://github.com/FrancescoSisti/laravel-bdoctors',
      imageUrl: 'https://placehold.co/800x600/2a2a2a/e6e6e6?text=BDoctors',
      imageAlt: 'Laravel BDoctors Platform Preview'
    }
  ];

  socialLinks = [
    {
      url: 'https://github.com/FrancescoSisti',
      icon: 'fab fa-github',
      label: 'GitHub'
    },
    {
      url: 'https://www.linkedin.com/in/francesco-sisti-21b88023a/',
      icon: 'fab fa-linkedin-in',
      label: 'LinkedIn'
    },
    {
      url: 'https://www.instagram.com/_francescosisti_/',
      icon: 'fab fa-instagram',
      label: 'Instagram'
    }
  ];

  stats: Stat[] = [
    {
      value: 2,
      symbol: '+',
      label: 'Anni di Esperienza',
      details: {
        title: 'Esperienza Professionale',
        description: 'Due anni di esperienza nello sviluppo web, specializzandomi in:',
        items: [
          'Sviluppo Full Stack con Angular e Laravel',
          'Progettazione UI/UX',
          'Ottimizzazione delle performance',
          'Gestione di progetti end-to-end'
        ]
      }
    },
    {
      value: 15,
      symbol: '+',
      label: 'Progetti Completati',
      details: {
        title: 'Portfolio Progetti',
        description: 'Progetti sviluppati in diversi settori:',
        items: [
          'Siti web aziendali',
          'E-commerce',
          'Applicazioni web',
          'Dashboard amministrative',
          'Integrazioni API'
        ]
      }
    },
    {
      value: 5,
      symbol: '+',
      label: 'Tecnologie Utilizzate',
      details: {
        title: 'Stack Tecnologico',
        description: 'Competenze principali in:',
        items: [
          'Frontend: Angular, Vue.js, HTML5, CSS3, JavaScript',
          'Backend: PHP, Laravel, Node.js',
          'Database: MySQL, MongoDB',
          'Tools: Git, Docker, AWS',
          'Design: Figma, Adobe XD'
        ]
      }
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
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
  }

  ngOnDestroy() { }

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

  toggleTooltip(index: number) {
    if (this.isMobile) {
      this.activeTooltip = this.activeTooltip === index ? null : index;
    }
  }

  showTooltip(index: number) {
    if (!this.isMobile) {
      this.activeTooltip = index;
    }
  }

  hideTooltip() {
    if (!this.isMobile) {
      this.activeTooltip = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isMobile && this.activeTooltip !== null) {
      const tooltip = document.querySelector('.stat-tooltip.active');
      const stat = document.querySelector('.stat');
      if (tooltip && stat && !stat.contains(event.target as Node)) {
        this.activeTooltip = null;
      }
    }
  }
}
