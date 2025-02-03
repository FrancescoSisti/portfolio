import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;

  isMenuOpen = false;
  currentRoute = '';
  hoveredIndex = -1;
  private routerSubscription?: Subscription;
  private isBrowser: boolean;
  private scrollThreshold = 50;
  private lastScrollTop = 0;
  isNavbarVisible = true;

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      if (this.isBrowser && window.innerWidth < 768) {
        this.closeMenu();
      }
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
