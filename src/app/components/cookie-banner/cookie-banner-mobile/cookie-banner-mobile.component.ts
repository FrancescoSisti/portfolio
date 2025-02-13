import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CookieService } from '../../../services/cookie.service';

@Component({
  selector: 'app-cookie-banner-mobile',
  templateUrl: './cookie-banner-mobile.component.html',
  styleUrls: ['./cookie-banner-mobile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CookieBannerMobileComponent implements OnInit {
  showBanner = false;
  showPreferences = false;
  preferences = {
    necessary: true,
    analytics: true,
    marketing: true
  };

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    this.showBanner = !this.cookieService.hasGivenConsent();
    const currentConsent = this.cookieService.getCookieConsent();
    if (currentConsent) {
      this.preferences = { ...currentConsent };
    }
  }

  acceptAll(): void {
    this.cookieService.acceptAllCookies();
    this.showBanner = false;
    this.showPreferences = false;
  }

  acceptNecessary(): void {
    this.cookieService.acceptNecessaryCookiesOnly();
    this.showBanner = false;
    this.showPreferences = false;
  }

  savePreferences(): void {
    this.cookieService.setCookieConsent(this.preferences);
    this.showBanner = false;
    this.showPreferences = false;
  }

  togglePreferences(): void {
    this.showPreferences = !this.showPreferences;
  }
}
