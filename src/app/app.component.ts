import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, NgZone, ApplicationRef } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScrollService } from './services/scroll.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { WeatherService, WeatherData } from './services/weather.service';
import { DashboardService } from './services/dashboard.service';
import { SeoService } from './services/seo.service';
import { PerformanceService } from './services/performance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, LoaderComponent],
  providers: [WeatherService]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'portfolio';
  currentTime: Date = new Date();
  temperature: number | string = '--';
  weatherDescription: string = 'Caricamento...';
  greeting: string = '';
  private timeInterval: any;
  private weatherInterval: any;
  private dashboardCollapseTimeout: any;
  private isHydrated = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private scrollService: ScrollService,
    private router: Router,
    private loaderService: LoaderService,
    private weatherService: WeatherService,
    public dashboardService: DashboardService,
    private seoService: SeoService,
    private performanceService: PerformanceService
  ) {
    this.setInitialValues();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loaderService.hide();
        }, 500); // Minimo mezzo secondo di loader per evitare flash
      }
    });
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(async () => {
        try {
          await firstValueFrom(this.appRef.isStable);
          this.ngZone.run(() => {
            this.isHydrated = true;
            this.initBrowserFeatures();
            this.dashboardCollapseTimeout = setTimeout(() => {
              this.ngZone.run(() => {
                this.dashboardService.setDashboardCollapsed(true);
              });
            }, 5000);
          });
        } catch (error) {
          console.error('Error during hydration:', error);
        }
      });
    }
    this.seoService.setCanonicalUrl();
    this.updateGreeting();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
      if (this.weatherInterval) {
        clearInterval(this.weatherInterval);
      }
      if (this.dashboardCollapseTimeout) {
        clearTimeout(this.dashboardCollapseTimeout);
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
    this.ngZone.runOutsideAngular(() => {
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
    const hour = this.currentTime.getHours();
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
      const weatherData: WeatherData = await firstValueFrom(this.weatherService.getCurrentWeather());
      this.temperature = weatherData.temperature;
      this.weatherDescription = weatherData.description;
    } catch (error) {
      console.error('Error fetching weather:', error);
      this.temperature = '--';
      this.weatherDescription = 'Non disponibile';
    }
  }
}
