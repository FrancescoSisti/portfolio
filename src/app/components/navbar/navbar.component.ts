import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslationService, Language } from '../../services/translation.service';

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
  isMenuOpen = false;
  currentRoute = '/';
  hoveredIndex = -1;
  currentLang: Language = 'en';
  private routerSubscription?: Subscription;
  private langSubscription?: Subscription;
  private isBrowser: boolean;

  menuItems: MenuItem[] = [
    {
      text: 'home',
      route: '/',
      preview: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'welcome',
      previewDesc: 'welcomeDesc'
    },
    {
      text: 'about',
      route: '/about',
      preview: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'aboutMe',
      previewDesc: 'aboutDesc'
    },
    {
      text: 'projects',
      route: '/projects',
      preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'myWork',
      previewDesc: 'projectsDesc'
    },
    {
      text: 'skills',
      route: '/skills',
      preview: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'myExpertise',
      previewDesc: 'skillsDesc'
    },
    {
      text: 'contact',
      route: '/contact',
      preview: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1000&auto=format&fit=crop',
      previewTitle: 'getInTouch',
      previewDesc: 'contactDesc'
    }
  ];

  constructor(
    private router: Router,
    private translationService: TranslationService,
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

    this.langSubscription = this.translationService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.currentRoute = this.router.url;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
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
    if (this.currentRoute === route) {
      this.closeMenu();
    }
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'en' ? 'it' : 'en';
    this.translationService.setLanguage(newLang);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
