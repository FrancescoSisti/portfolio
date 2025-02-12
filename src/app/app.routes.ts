import { Routes } from '@angular/router';
import { isMobileDevice } from './utils/device.utils';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component')
      .then(m => m.AboutComponent),
    title: 'Chi Sono',
    data: { preload: true }
  },
  {
    path: 'projects',
    loadComponent: () => {
      if (isMobileDevice()) {
        return import('./components/projects/projects-mobile/projects-mobile.component')
          .then(m => m.ProjectsMobileComponent);
      }
      return import('./components/projects/projects.component')
        .then(m => m.ProjectsComponent);
    },
    title: 'Progetti',
    data: { preload: true }
  },
  {
    path: 'skills',
    loadComponent: () => import('./components/skills/skills.component')
      .then(m => m.SkillsComponent),
    title: 'Competenze',
    data: { preload: true }
  },
  {
    path: 'contact',
    loadComponent: () => {
      if (isMobileDevice()) {
        return import('./components/contact/contact-mobile/contact-mobile.component')
          .then(m => m.ContactMobileComponent);
      }
      return import('./components/contact/contact.component')
        .then(m => m.ContactComponent);
    },
    title: 'Contatti',
    data: { preload: true }
  },
  {
    path: 'changelog',
    loadComponent: () => {
      if (isMobileDevice()) {
        return import('./components/changelog/changelog-mobile/changelog-mobile.component')
          .then(m => m.ChangelogMobileComponent);
      }
      return import('./components/changelog/changelog/changelog.component')
        .then(m => m.ChangelogComponent);
    },
    title: 'Changelog'
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
