import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // ADMIN ACCESS FIX: Hidden admin access via multiple clicks
  private clickCount = 0;
  private clickTimeout: any;

  socialLinks = [
    {
      url: 'https://github.com/FrancescoSisti',
      icon: 'fab fa-github',
      label: 'GitHub'
    },
    {
      url: 'https://www.linkedin.com/in/francesco-sisti-21b88023a/',
      icon: 'fab fa-linkedin-in',
      label: 'LinkedIn'
    },
    {
      url: 'https://www.instagram.com/_francescosisti_/',
      icon: 'fab fa-instagram',
      label: 'Instagram'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ADMIN ACCESS FIX: Hidden access via copyright click
  onCopyrightClick(): void {
    this.clickCount++;

    // Clear existing timeout
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }

    // If 7 clicks within 3 seconds, enable admin access
    if (this.clickCount >= 7) {
      this.activateAdminAccess();
      return;
    }

    // Reset click count after 3 seconds
    this.clickTimeout = setTimeout(() => {
      this.clickCount = 0;
    }, 3000);
  }

  private activateAdminAccess(): void {
    this.clickCount = 0;
    this.authService.enableAdminAccess();
    
    // Show subtle notification
    this.showAdminNotification();
    
    // Navigate to admin after short delay
    setTimeout(() => {
      this.router.navigate(['/admin']);
    }, 1500);
  }

  private showAdminNotification(): void {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.innerHTML = '🔧 Admin access enabled';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2c3e50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 3000);
  }

  // Check if admin access is enabled
  get isAdminEnabled(): boolean {
    return this.authService.isLoggedIn();
  }
}
