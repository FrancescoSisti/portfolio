import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface MenuItem {
  text: string;
  route: string;
  icon: string;
  title: string;
}

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarMobileComponent implements OnInit, OnDestroy {
  currentPageTitle = 'Home';
  currentRoute = '';
  showBackButton = false;
  private routerSubscription?: Subscription;
  private isBrowser: boolean;
  private scrollThreshold = 20;
  private lastScrollTop = 0;
  private scrollTimer: any;
  isNavbarVisible = true;
  isAtTop = true;

  menu: MenuItem[] = [
    {
      text: 'Home',
      route: '',
      icon: 'fas fa-house',
      title: 'Home'
    },
    {
      text: 'Chi Sono',
      route: 'about',
      icon: 'fas fa-user',
      title: 'Chi Sono'
    },
    {
      text: 'Progetti',
      route: 'projects',
      icon: 'fas fa-code',
      title: 'Progetti'
    },
    {
      text: 'Skills',
      route: 'skills',
      icon: 'fas fa-laptop-code',
      title: 'Competenze'
    },
    {
      text: 'Contatti',
      route: 'contact',
      icon: 'fas fa-envelope',
      title: 'Contatti'
    }
  ];

  constructor(
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.updatePageTitle();
      this.updateBackButton();
    });

    if (this.isBrowser) {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    this.currentRoute = this.router.url;
    this.updatePageTitle();
    this.updateBackButton();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.isBrowser) {
      window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
  }

  private handleScroll(): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    const currentScrollTop = window.scrollY;
    this.isAtTop = currentScrollTop < 10;

    // Se siamo all'inizio della pagina, mostra sempre la navbar
    if (this.isAtTop) {
      this.isNavbarVisible = true;
      return;
    }

    // Ignora piccoli movimenti di scroll
    if (Math.abs(currentScrollTop - this.lastScrollTop) < this.scrollThreshold) {
      return;
    }

    // Scroll verso il basso
    if (currentScrollTop > this.lastScrollTop) {
      this.isNavbarVisible = false;
    }
    // Scroll verso l'alto
    else {
      this.isNavbarVisible = true;
    }

    // Aggiorna l'ultima posizione di scroll
    this.lastScrollTop = currentScrollTop;

    // Imposta un timer per mostrare la navbar dopo che lo scroll si è fermato
    this.scrollTimer = setTimeout(() => {
      if (currentScrollTop > 100) {
        this.isNavbarVisible = false;
      }
    }, 2000);
  }

  private updatePageTitle(): void {
    const currentMenuItem = this.menu.find(item =>
      this.currentRoute === '/' + item.route ||
      (item.route === '' && this.currentRoute === '/')
    );
    this.currentPageTitle = currentMenuItem?.title || 'Home';
  }

  private updateBackButton(): void {
    // Mostra il pulsante indietro se non siamo nella home
    this.showBackButton = this.currentRoute !== '/';
  }

  goBack(): void {
    this.location.back();
  }
}
