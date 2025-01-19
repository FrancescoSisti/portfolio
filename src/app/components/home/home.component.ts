import { Component, OnInit, HostListener, PLATFORM_ID, Inject, OnDestroy, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  temperature: number | string = '--';
  weatherDescription: string = 'Caricamento...';
  greeting: string = '';
  private timeInterval: any;
  private weatherInterval: any;
  private isHydrated = false;

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {
    this.setInitialValues();
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

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      if (this.weatherInterval) {
        clearInterval(this.weatherInterval);
      }
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

  private setInitialValues() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = 'Buongiorno';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'Buon pomeriggio';
    } else {
      this.greeting = 'Buonasera';
    }
    this.temperature = '18';
    this.weatherDescription = 'Soleggiato';
  }

  private initBrowserFeatures() {
    this.ngZone.runOutsideAngular(() => {
      this.initScrollAnimations();
      this.initDashboard();
    });
  }

  private initDashboard() {
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.updateTime();
      });
    }, 1000);

    this.updateWeather();
    this.weatherInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.updateWeather();
      });
    }, 30 * 60 * 1000);
  }

  private updateTime() {
    this.currentTime = new Date();
    this.updateGreeting();
  }

  private updateGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting = 'Buongiorno';
    } else if (hour >= 12 && hour < 18) {
      this.greeting = 'Buon pomeriggio';
    } else {
      this.greeting = 'Buonasera';
    }
  }

  private async updateWeather() {
    try {
      // Temporary mock data since API key is not configured
      this.temperature = '18';
      this.weatherDescription = 'Soleggiato';
    } catch (error) {
      console.error('Error fetching weather:', error);
      this.temperature = '--';
      this.weatherDescription = 'Non disponibile';
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
}
