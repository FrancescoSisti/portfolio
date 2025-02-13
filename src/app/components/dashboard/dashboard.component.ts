import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, NgZone, ApplicationRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { WeatherService, WeatherData } from '../../services/weather.service';
import { DashboardService } from '../../services/dashboard.service';
import { CookieService, CookieConsent } from '../../services/cookie.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="verona-dashboard" [class.collapsed]="(dashboardService.isDashboardCollapsed$ | async)">
      <div class="dashboard-toggle">
        <i class="fas fa-compass"></i>
      </div>
      <div class="dashboard-card">
        <div class="time-section">
          <i class="far fa-clock"></i>
          <span class="time">{{currentTime | date:'HH:mm:ss'}}</span>
          <span class="date">{{currentTime | date:'dd MMM yyyy'}}</span>
        </div>
        <div class="weather-section">
          <i class="fas fa-cloud-sun"></i>
          <span class="temperature">{{temperature}}°C</span>
          <span class="weather-desc">{{weatherDescription}}</span>
        </div>
        <div class="greeting-section">
          <i class="far fa-smile"></i>
          <span class="greeting">{{greeting}}</span>
          <span class="location">Verona, Italia</span>
        </div>
        <div class="cookie-section">
          <div class="section-header" (click)="toggleCookieSettings()">
            <i class="fas fa-cookie-bite"></i>
            <span>Impostazioni Cookie</span>
            <i class="fas" [class.fa-chevron-down]="!showCookieSettings" [class.fa-chevron-up]="showCookieSettings"></i>
          </div>
          <div class="cookie-settings" *ngIf="showCookieSettings">
            <div class="cookie-option">
              <label>
                <input type="checkbox" [(ngModel)]="cookiePreferences.necessary" disabled>
                Cookie Essenziali
              </label>
              <span class="description">Necessari per il funzionamento del sito</span>
            </div>
            <div class="cookie-option">
              <label>
                <input type="checkbox" [(ngModel)]="cookiePreferences.analytics">
                Cookie Analitici
              </label>
              <span class="description">Per analizzare l'utilizzo e migliorare il sito</span>
            </div>
            <div class="cookie-option">
              <label>
                <input type="checkbox" [(ngModel)]="cookiePreferences.marketing">
                Cookie Marketing
              </label>
              <span class="description">Per personalizzare gli annunci</span>
            </div>
            <div class="cookie-actions">
              <button class="btn-save" (click)="saveCookiePreferences()">
                <i class="fas fa-save"></i>
                Salva preferenze
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  temperature: number | string = '--';
  weatherDescription: string = 'Caricamento...';
  greeting: string = '';
  showCookieSettings = false;
  cookiePreferences: CookieConsent = {
    necessary: true,
    analytics: true,
    marketing: true
  };
  private timeInterval: any;
  private weatherInterval: any;
  private dashboardCollapseTimeout: any;
  private isHydrated = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    private weatherService: WeatherService,
    public dashboardService: DashboardService,
    private cookieService: CookieService
  ) {
    this.setInitialValues();
  }

  private setInitialValues() {
    this.currentTime = new Date();
    this.updateGreeting();
    const currentConsent = this.cookieService.getCookieConsent();
    if (currentConsent) {
      this.cookiePreferences = { ...currentConsent };
    }
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(async () => {
        try {
          await firstValueFrom(this.appRef.isStable);
          this.ngZone.run(() => {
            this.isHydrated = true;
            this.initDashboard();
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
      const data = await firstValueFrom(this.weatherService.getCurrentWeather());
      this.temperature = data.temperature;
      this.weatherDescription = data.description;
    } catch (error) {
      console.error('Error fetching weather:', error);
      this.temperature = '--';
      this.weatherDescription = 'Non disponibile';
    }
  }

  toggleCookieSettings() {
    this.showCookieSettings = !this.showCookieSettings;
  }

  saveCookiePreferences() {
    this.cookieService.setCookieConsent(this.cookiePreferences);
    this.showCookieSettings = false;
  }
}
