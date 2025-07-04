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
  // ADMIN ACCESS FIX: Simple admin access for frontend-only portfolio
  private readonly ADMIN_ACCESS_KEY = 'portfolio_admin_access';
  private readonly ADMIN_SESSION_KEY = 'admin_session_active';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.checkAdminAccess();
  }

  private checkAdminAccess(): void {
    // Check if admin session is active
    const adminSession = sessionStorage.getItem(this.ADMIN_SESSION_KEY);
    
    if (adminSession === 'true') {
      const adminUser: User = {
        username: 'Administrator',
        isAdmin: true,
        lastLogin: new Date()
      };
      this.currentUserSubject.next(adminUser);
    }
  }

  // ADMIN ACCESS FIX: Enable admin access without credentials
  enableAdminAccess(): void {
    const adminUser: User = {
      username: 'Administrator', 
      isAdmin: true,
      lastLogin: new Date()
    };

    // Use sessionStorage so access expires when browser closes
    sessionStorage.setItem(this.ADMIN_SESSION_KEY, 'true');
    this.currentUserSubject.next(adminUser);
  }

  // Legacy login method for backward compatibility (now simplified)
  login(username: string, password: string): Observable<boolean> {
    // For demo purposes, accept any credentials and enable admin access
    if (username && password) {
      return of(true).pipe(
        delay(500),
        tap(() => this.enableAdminAccess())
      );
    }
    return of(false).pipe(delay(500));
  }

  logout(): void {
    sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.ADMIN_SESSION_KEY) === 'true';
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // ADMIN ACCESS FIX: Check if user has admin privileges
  isAdmin(): boolean {
    const user = this.currentUser;
    return user ? user.isAdmin : false;
  }
}
