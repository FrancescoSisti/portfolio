import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  username: string = '';
  isAuthenticated: boolean = false;

  // Rendiamo il router pubblico per usarlo nel template
  public router = inject(Router);

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Controllo se l'utente è autenticato
    this.isAuthenticated = this.authService.isLoggedIn();

    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    // Recupero il nome utente
    const user = this.authService.currentUser;
    if (user) {
      this.username = user.username;
    }
  }

  // Gestisce il logout dell'utente
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Metodi per la gestione dei progetti (da implementare)
  manageProjects(): void {
    this.router.navigate(['/admin/projects']);
  }

  // Metodi per la gestione delle skills (da implementare)
  manageSkills(): void {
    this.router.navigate(['/admin/skills']);
  }

  // Metodi per la gestione del profilo (da implementare)
  manageProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  // Visualizzazione delle statistiche (da implementare)
  viewStatistics(): void {
    this.router.navigate(['/admin/statistics']);
  }
}
