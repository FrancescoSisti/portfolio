import { Routes } from '@angular/router';
import { isMobileDevice } from './utils/device.utils';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Francesco Sisti • Full Stack Developer & UI Designer | Portfolio',
    data: {
      description: 'Portfolio professionale di Francesco Sisti - Full Stack Developer & UI Designer a Verona. Esperienza in sviluppo web, design UI/UX e ottimizzazione delle performance.',
      preload: true
    }
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent),
    title: 'Francesco Sisti • Full Stack Developer & UI Designer | Portfolio',
    data: {
      description: 'Portfolio professionale di Francesco Sisti - Full Stack Developer & UI Designer a Verona. Esperienza in sviluppo web, design UI/UX e ottimizzazione delle performance.',
      preload: true
    }
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about/about.component')
      .then(m => m.AboutComponent),
    title: 'Chi Sono | Francesco Sisti - Full Stack Developer',
    data: {
      description: 'Scopri chi sono: Full Stack Developer con esperienza in sviluppo web, UI/UX design e ottimizzazione delle performance. Base a Verona, Italia.',
      preload: true
    }
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
    title: 'Progetti | Francesco Sisti - Portfolio Developer',
    data: {
      description: 'Esplora i miei progetti di sviluppo web: applicazioni moderne, siti web responsive e soluzioni digitali innovative. Portfolio di Francesco Sisti.',
      preload: true
    }
  },
  {
    path: 'skills',
    loadComponent: () => import('./components/skills/skills.component')
      .then(m => m.SkillsComponent),
    title: 'Competenze | Francesco Sisti - Full Stack Developer',
    data: {
      description: 'Le mie competenze tecniche: sviluppo frontend e backend, UI/UX design, ottimizzazione delle performance e molto altro. Stack tecnologico completo.',
      preload: true
    }
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
    title: 'Contatti | Francesco Sisti - Full Stack Developer',
    data: {
      description: 'Contattami per collaborazioni, progetti o informazioni. Full Stack Developer & UI Designer disponibile per nuove opportunità a Verona e da remoto.',
      preload: true
    }
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
    title: 'Changelog | Francesco Sisti - Portfolio',
    data: {
      description: 'Scopri gli ultimi aggiornamenti e miglioramenti apportati al portfolio. Registro delle modifiche e novità implementate.',
      preload: true
    }
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./components/privacy-policy/privacy-policy.component')
      .then(m => m.PrivacyPolicyComponent),
    title: 'Informativa sulla Privacy | Francesco Sisti',
    data: {
      description: 'Informativa sulla Privacy del sito web di Francesco Sisti. Scopri come trattiamo i tuoi dati personali e utilizziamo i cookie.',
      preload: false
    }
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./components/terms-of-service/terms-of-service.component')
      .then(m => m.TermsOfServiceComponent),
    title: 'Termini e Condizioni | Francesco Sisti',
    data: {
      description: 'Termini e condizioni di utilizzo del sito web di Francesco Sisti. Informazioni legali e regolamenti.',
      preload: true
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent),
    title: 'Login | Francesco Sisti',
    data: {
      description: 'Accedi all\'area di amministrazione del portfolio.',
      preload: false
    }
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component')
      .then(m => m.AdminComponent),
    title: 'Area Amministrazione | Francesco Sisti',
    canActivate: [authGuard],
    data: {
      description: 'Area di amministrazione privata per la gestione del sito.',
      preload: false
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard | Area Amministrazione',
      },
      {
        path: 'projects',
        loadComponent: () => import('./components/admin/projects/projects.component')
          .then(m => m.ProjectsComponent),
        title: 'Gestione Progetti | Area Amministrazione',
      },
      {
        path: 'skills',
        loadComponent: () => import('./components/admin/skills/skills.component')
          .then(m => m.SkillsComponent),
        title: 'Gestione Skills | Area Amministrazione',
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/admin/profile/profile.component')
          .then(m => m.ProfileComponent),
        title: 'Gestione Profilo | Area Amministrazione',
      },
      {
        path: 'statistics',
        loadComponent: () => import('./components/admin/statistics/statistics.component')
          .then(m => m.StatisticsComponent),
        title: 'Statistiche | Area Amministrazione',
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
