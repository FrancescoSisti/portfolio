import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly COOKIE_CONSENT_KEY = 'cookie_consent';
  private cookieConsentSubject = new BehaviorSubject<CookieConsent | null>(null);
  cookieConsent$ = this.cookieConsentSubject.asObservable();

  constructor() {
    this.initializeCookieConsent();
  }

  private initializeCookieConsent(): void {
    const savedConsent = localStorage.getItem(this.COOKIE_CONSENT_KEY);
    if (savedConsent) {
      this.cookieConsentSubject.next(JSON.parse(savedConsent));
    }
  }

  setCookieConsent(consent: CookieConsent): void {
    localStorage.setItem(this.COOKIE_CONSENT_KEY, JSON.stringify(consent));
    this.cookieConsentSubject.next(consent);
  }

  getCookieConsent(): CookieConsent | null {
    return this.cookieConsentSubject.value;
  }

  hasGivenConsent(): boolean {
    return this.cookieConsentSubject.value !== null;
  }

  acceptAllCookies(): void {
    this.setCookieConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
  }

  acceptNecessaryCookiesOnly(): void {
    this.setCookieConsent({
      necessary: true,
      analytics: false,
      marketing: false
    });
  }

  resetCookieConsent(): void {
    localStorage.removeItem(this.COOKIE_CONSENT_KEY);
    this.cookieConsentSubject.next(null);
  }
}
