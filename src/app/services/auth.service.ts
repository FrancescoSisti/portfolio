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
  // Credenziali di esempio (in un caso reale, queste sarebbero gestite dal backend)
  private readonly ADMIN_USERNAME = 'admin';
  private readonly ADMIN_PASSWORD = 'password123';

  // Token storage keys
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';

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

    if (token && userData) {
      try {
        // Verifica validità token (in un caso reale, verificheremmo con il backend)
        this.authToken = token;
        const user = JSON.parse(userData);

        // Aggiungi controllo della scadenza se necessario
        this.currentUserSubject.next(user);

      } catch (error) {
        // In caso di errore, pulisci i dati di autenticazione
        this.clearAuthData();
      }
    }
  }

  login(username: string, password: string): Observable<boolean> {
    // In un caso reale, questo invierebbe una richiesta API
    // Simuliamo un ritardo per emulare una chiamata API
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      return of(true).pipe(
        delay(800), // Simulare il ritardo di rete
        tap(() => {
          // Genera un token fittizio (in un caso reale, verrebbe dal backend)
          const fakeToken = this.generateFakeToken();

          const user: User = {
            username,
            isAdmin: true,
            lastLogin: new Date()
          };

          // Salva i dati di autenticazione
          this.saveAuthData(fakeToken, user);

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
    return !!this.authToken && !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Metodi helper per la gestione dell'autenticazione
  private saveAuthData(token: string, user: User): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
  }

  private generateFakeToken(): string {
    // Crea un token fittizio (per demo)
    const randomPart = Math.random().toString(36).substring(2);
    const timestamp = new Date().getTime();
    return `demo-token-${randomPart}-${timestamp}`;
  }
}
