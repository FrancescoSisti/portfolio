import { Component, OnInit, HostListener, PLATFORM_ID, Inject, OnDestroy, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) {
    // Initialize values immediately
    this.setInitialValues();
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Run outside Angular zone to prevent blocking hydration
      this.ngZone.runOutsideAngular(async () => {
        try {
          await firstValueFrom(this.appRef.isStable);
          // Run initialization back inside Angular zone
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
    // Run timers outside Angular zone to prevent blocking hydration
    this.ngZone.runOutsideAngular(() => {
      this.initScrollAnimations();
      this.initDashboard();
    });
  }

  private initDashboard() {
    // Update time every second
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.updateTime();
      });
    }, 1000);

    // Update weather every 30 minutes
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

  scrollToContent() {
    if (!this.isHydrated) return;

    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        const featuredWork = document.querySelector('.featured-work');
        if (featuredWork) {
          featuredWork.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}
