import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface MenuItem {
  text: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarMobileComponent implements OnInit, OnDestroy {
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;

  isMenuOpen = false;
  currentRoute = '';
  private routerSubscription?: Subscription;
  private isBrowser: boolean;
  private scrollThreshold = 50;
  private lastScrollTop = 0;
  isNavbarVisible = true;

  menu: MenuItem[] = [
    {
      text: 'Home',
      route: '',
      icon: 'fas fa-home'
    },
    {
      text: 'Chi Sono',
      route: 'about',
      icon: 'fas fa-user'
    },
    {
      text: 'Progetti',
      route: '/projects',
      icon: 'fas fa-code'
    },
    {
      text: 'Competenze',
      route: '/skills',
      icon: 'fas fa-laptop-code'
    },
    {
      text: 'Contatti',
      route: '/contact',
      icon: 'fas fa-envelope'
    }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.closeMenu();
    });

    this.currentRoute = this.router.url;

    if (this.isBrowser) {
      window.addEventListener('scroll', this.handleScroll.bind(this));
      window.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.isBrowser) {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
      window.removeEventListener('keydown', this.handleKeyPress.bind(this));
    }
  }

  private handleScroll(): void {
    const currentScrollTop = window.scrollY;

    if (Math.abs(currentScrollTop - this.lastScrollTop) < this.scrollThreshold) {
      return;
    }

    this.isNavbarVisible = currentScrollTop < this.lastScrollTop || currentScrollTop < this.scrollThreshold;
    this.lastScrollTop = currentScrollTop;
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

  private animateMenuItems(): void {
    this.menuItems.forEach((item: ElementRef, index: number) => {
      setTimeout(() => {
        item.nativeElement.classList.add('show');
      }, index * 100);
    });
  }

  closeMenu() {
    this.isMenuOpen = false;
    if (this.isBrowser) {
      document.body.style.overflow = '';
      this.menuItems.forEach((item: ElementRef) => {
        item.nativeElement.classList.remove('show');
      });
    }
  }

  onItemClick(route: string) {
    this.closeMenu();
  }
}
