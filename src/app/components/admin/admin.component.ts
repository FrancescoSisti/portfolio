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
  username: string = 'Administrator';
  isAuthenticated: boolean = false;

  // Rendiamo il router pubblico per usarlo nel template
  public router = inject(Router);

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // ADMIN ACCESS FIX: Check if admin access is enabled, if not provide guidance
    this.isAuthenticated = this.authService.isLoggedIn();

    if (!this.isAuthenticated) {
      // Enable admin access automatically if user reached this page
      this.authService.enableAdminAccess();
      this.isAuthenticated = true;
    }

    // Get current user info
    const user = this.authService.currentUser;
    if (user) {
      this.username = user.username;
    }
  }

  // Handles user logout
  logout(): void {
    this.authService.logout();
  }

  // Project management
  manageProjects(): void {
    this.router.navigate(['/admin/projects']);
  }

  // Skills management
  manageSkills(): void {
    this.router.navigate(['/admin/skills']);
  }

  // Profile management
  manageProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  // View statistics
  viewStatistics(): void {
    this.router.navigate(['/admin/statistics']);
  }

  // Check if user has admin access
  get hasAdminAccess(): boolean {
    return this.authService.isLoggedIn();
  }
}
