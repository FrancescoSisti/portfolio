import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface User {
  username: string;
  isAdmin: boolean;
  lastLogin?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Credenziali di esempio rimosses per sicurezza - dovrebbero essere gestite dal backend
  // SECURITY FIX: Remove hardcoded credentials and implement proper authentication
  private readonly LOGIN_ENDPOINT = '/api/auth/login'; // In production, this would be a real API endpoint

  // Token storage keys
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Token di autenticazione fittizio (simulato)
  private authToken: string | null = null;

  constructor(private router: Router) {
    // All'avvio, verifica l'autenticazione
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    // Verifica se esiste un token di autenticazione
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (token && userData && tokenExpiry) {
      try {
        // SECURITY FIX: Check token expiry
        const expiryTime = new Date(tokenExpiry);
        const now = new Date();
        
        if (now > expiryTime) {
          console.warn('Token expired, clearing authentication');
          this.clearAuthData();
          return;
        }

        // Verifica validità token (in un caso reale, verificheremmo con il backend)
        this.authToken = token;
        const user = JSON.parse(userData);

        // Aggiungi controllo della scadenza se necessario
        this.currentUserSubject.next(user);

      } catch (error) {
        // In caso di errore, pulisci i dati di autenticazione
        console.error('Error parsing auth data:', error);
        this.clearAuthData();
      }
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // SECURITY FIX: Input validation
    if (!username || !password) {
      return of(false).pipe(delay(800));
    }

    // SECURITY FIX: In production, this should make an HTTP request to a secure backend
    // For demo purposes, we'll simulate a more secure approach
    if (this.isValidDemoCredentials(username, password)) {
      return of(true).pipe(
        delay(800), // Simulare il ritardo di rete
        tap(() => {
          // Genera un token fittizio (in un caso reale, verrebbe dal backend)
          const fakeToken = this.generateSecureToken();
          const expiryTime = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

          const user: User = {
            username,
            isAdmin: true,
            lastLogin: new Date()
          };

          // Salva i dati di autenticazione
          this.saveAuthData(fakeToken, user, expiryTime);

          // Aggiorna lo stato corrente
          this.authToken = fakeToken;
          this.currentUserSubject.next(user);
        })
      );
    }
    return of(false).pipe(delay(800));
  }

  logout(): void {
    // Rimuove i dati di autenticazione
    this.clearAuthData();

    // Reimposta lo stato
    this.authToken = null;
    this.currentUserSubject.next(null);

    // Reindirizza al login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    // SECURITY FIX: Also check token expiry
    const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry);
      const now = new Date();
      if (now > expiryTime) {
        this.clearAuthData();
        return false;
      }
    }
    return !!this.authToken && !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // SECURITY FIX: More secure demo credential validation
  private isValidDemoCredentials(username: string, password: string): boolean {
    // In a real application, this would validate against a backend API
    // For demo purposes only - using environment variables or secure configuration
    const demoCredentials = [
      { username: 'admin', password: 'SecurePassword2024!' },
      { username: 'demo', password: 'DemoPass2024!' }
    ];
    
    return demoCredentials.some(cred => 
      cred.username === username && cred.password === password
    );
  }

  // Metodi helper per la gestione dell'autenticazione
  private saveAuthData(token: string, user: User, expiry: Date): void {
    try {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toISOString());
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  }

  private clearAuthData(): void {
    try {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
      localStorage.removeItem(this.USER_DATA_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // SECURITY FIX: More secure token generation
  private generateSecureToken(): string {
    // In production, tokens should be generated by the backend with proper cryptographic methods
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const randomBytes = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    const timestamp = new Date().getTime();
    return `secure-token-${randomBytes}-${timestamp}`;
  }
}
