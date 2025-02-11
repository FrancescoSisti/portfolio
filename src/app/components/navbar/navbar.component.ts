import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobile.component';
import { ResponsiveService } from '../../services/responsive.service';

interface MenuItem {
  text: string;
  route: string;
  preview: string;
  previewTitle: string;
  previewDesc: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarMobileComponent]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  currentRoute = '';
  hoveredIndex = -1;
  isMobile = false;
  private routerSubscription?: Subscription;
  private responsiveSubscription?: Subscription;
  private isBrowser: boolean;

  menu: MenuItem[] = [
    {
      text: 'Home',
      route: '',
      preview: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'Benvenuto',
      previewDesc: 'Portfolio moderno e creativo'
    },
    {
      text: 'Chi Sono',
      route: 'about',
      preview: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'Chi Sono',
      previewDesc: 'Scopri il mio percorso e la mia esperienza'
    },
    {
      text: 'Progetti',
      route: '/projects',
      preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'I Miei Lavori',
      previewDesc: 'Esplora i miei ultimi progetti e esperimenti'
    },
    {
      text: 'Competenze',
      route: '/skills',
      preview: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'Le Mie Competenze',
      previewDesc: 'Scopri le mie competenze tecniche'
    },
    {
      text: 'Contatti',
      route: '/contact',
      preview: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'Contattami',
      previewDesc: 'Parliamo del tuo prossimo progetto'
    }
  ];

  constructor(
    private router: Router,
    private responsiveService: ResponsiveService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      if (this.isBrowser) {
        this.closeMenu();
      }
    });

    this.currentRoute = this.router.url;

    if (this.isBrowser) {
      this.responsiveSubscription = this.responsiveService.isMobile$.subscribe(
        isMobile => this.isMobile = isMobile
      );
      window.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.responsiveSubscription) {
      this.responsiveSubscription.unsubscribe();
    }
    if (this.isBrowser) {
      window.removeEventListener('keydown', this.handleKeyPress.bind(this));
    }
  }

  private handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isBrowser) {
      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
    this.hoveredIndex = -1;
  }

  onItemHover(index: number) {
    if (this.isMenuOpen) {
      this.hoveredIndex = index;
    }
  }

  onItemClick(route: string) {
    this.closeMenu();
  }
}
