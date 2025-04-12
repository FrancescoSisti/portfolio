import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  username: string = '';

  // Rendiamo il router pubblico per usarlo nel template
  public router = inject(Router);

  constructor(private authService: AuthService) {
    // Recupero il nome utente
    const user = this.authService.currentUser;
    if (user) {
      this.username = user.username;
    }
  }
}
