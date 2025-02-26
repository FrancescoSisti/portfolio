import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobile.component';
import { ResponsiveService } from '../../services/responsive.service';

interface MenuItem {
  text: string;
  route: string;
  icon: string;
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
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
  isMenuOpen = false;
  currentRoute = '';
  hoveredIndex = -1;
  isMobile = false;
  private routerSubscription?: Subscription;
  private responsiveSubscription?: Subscription;
  private isBrowser: boolean;
  private isAnimating = false;
  hideInAdmin = false;

  menu: MenuItem[] = [
    {
      text: 'Home',
      route: '/',
      icon: 'fas fa-home fa-fw',
      previewTitle: 'Benvenuto',
      previewDesc: 'Esplora il mio mondo digitale'
    },
    {
      text: 'Chi Sono',
      route: '/about',
      icon: 'fas fa-user fa-fw',
      previewTitle: 'Chi Sono',
      previewDesc: 'Un developer appassionato di design e tecnologia'
    },
    {
      text: 'Progetti',
      route: '/projects',
      icon: 'fas fa-code fa-fw',
      previewTitle: 'I Miei Lavori',
      previewDesc: 'Una selezione dei miei migliori progetti web'
    },
    {
      text: 'Competenze',
      route: '/skills',
      icon: 'fas fa-laptop-code fa-fw',
      previewTitle: 'Le Mie Competenze',
      previewDesc: 'Stack tecnologico e specializzazioni'
    },
    {
      text: 'Contatti',
      route: '/contact',
      icon: 'fas fa-envelope fa-fw',
      previewTitle: 'Contattami',
      previewDesc: 'Collaboriamo insieme sul tuo prossimo progetto'
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
    if (this.isBrowser) {
      this.routerSubscription = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;

        this.hideInAdmin = this.currentRoute.includes('/admin');

        this.closeMenu();
      });

      this.currentRoute = this.router.url;

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
      if (this.isMenuOpen) {
        this.animateMenuItems();
      }
    }
  }

  private blockMouseDuringAnimation(): void {
    this.isAnimating = true;
    document.body.style.pointerEvents = 'none';
    // Calcola il tempo totale di animazione basato sul numero di elementi
    const totalAnimationTime = (this.menu.length * 50) + 200; // Ridotto da 100ms a 50ms per item e da 400ms a 200ms di buffer
    setTimeout(() => {
      this.isAnimating = false;
      document.body.style.pointerEvents = '';
    }, totalAnimationTime);
  }

  private animateMenuItems(): void {
    setTimeout(() => {
      this.menuItems.forEach((item: ElementRef, index: number) => {
        setTimeout(() => {
          item.nativeElement.classList.add('show');
        }, index * 50); // Ridotto da 100ms a 50ms
      });
    }, 100); // Ridotto da 200ms a 100ms
  }

  closeMenu() {
    this.isMenuOpen = false;
    if (this.isBrowser) {
      document.body.style.overflow = '';
      this.menuItems.forEach((item: ElementRef) => {
        item.nativeElement.classList.remove('show');
      });
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
