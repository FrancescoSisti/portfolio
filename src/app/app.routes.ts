import { Routes } from '@angular/router';

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
    loadComponent: () => import('./components/projects/projects.component')
      .then(m => m.ProjectsComponent),
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
    loadComponent: () => import('./components/contact/contact.component')
      .then(m => m.ContactComponent),
    title: 'Contatti',
    data: { preload: true }
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
