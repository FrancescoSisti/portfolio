import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

interface Project {
  title: string;
  type: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  status?: 'completed' | 'in-progress' | 'planned';
}

@Component({
  selector: 'app-projects-mobile',
  templateUrl: './projects-mobile.component.html',
  styleUrls: ['./projects-mobile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProjectsMobileComponent {
  constructor(private sanitizer: DomSanitizer) {
    this.opusPreviewUrl = this.getSafeUrl('https://opusagency.it');
  }

  isModalOpen = false;
  showTimeoutMessage = false;
  opusPreviewUrl: SafeResourceUrl;
  private previewTimeoutId: any;

  featuredProjects: Project[] = [
    {
      title: 'Opus Agency Website',
      type: 'Full Stack Development',
      description: 'Sito web aziendale moderno con design personalizzato, ottimizzazione SEO e interfaccia utente reattiva.',
      liveUrl: 'https://opusagency.it/',
      technologies: ['Angular', 'TypeScript', 'SCSS', 'SEO', 'Responsive Design'],
      status: 'completed'
    },
    {
      title: 'Laravel BDoctors',
      type: 'Backend Development',
      description: 'Piattaforma per la gestione di profili medici con sistema di prenotazione e dashboard amministrativa.',
      githubUrl: 'https://github.com/FrancescoSisti/laravel-bdoctors',
      technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'API'],
      status: 'completed'
    },
    {
      title: 'Oracle Chatbot',
      type: 'AI Development',
      description: 'Chatbot intelligente basato su AI per l\'assistenza clienti e automazione delle risposte.',
      githubUrl: 'https://github.com/FrancescoSisti/oracle-chatbot',
      technologies: ['PHP', 'AI', 'API Integration', 'NLP'],
      status: 'completed'
    }
  ];

  get filteredFeaturedProjects(): Project[] {
    return this.featuredProjects.filter(p => p.title !== 'Opus Agency Website');
  }

  otherProjects = [
    {
      title: 'Wellness Website',
      description: 'Piattaforma moderna per il benessere e la salute con interfaccia reattiva e prenotazioni online.',
      technologies: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
      status: 'completed',
      githubUrl: 'https://github.com/FrancescoSisti/wellness-website-2.0'
    },
    {
      title: 'E-commerce Platform',
      description: 'Piattaforma e-commerce completa con gestione prodotti e pagamenti.',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'in-progress'
    },
    {
      title: 'Task Management System',
      description: 'Sistema di gestione attività con funzionalità collaborative.',
      technologies: ['React', 'Firebase', 'Material UI'],
      status: 'planned'
    },
    {
      title: 'Laravel API',
      description: 'API RESTful per la gestione di dati e autenticazione.',
      githubUrl: 'https://github.com/FrancescoSisti/laravel-api',
      technologies: ['Laravel', 'API', 'PHP'],
      status: 'completed'
    },
    {
      title: 'Vite Boolfolio',
      description: 'Portfolio dinamico costruito con Vite e Vue.js.',
      githubUrl: 'https://github.com/FrancescoSisti/vite-boolfolio',
      technologies: ['Vue.js', 'Vite', 'JavaScript'],
      status: 'completed'
    }
  ];

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openPreviewModal() {
    this.isModalOpen = true;
    this.showTimeoutMessage = false;
    this.previewTimeoutId = setTimeout(() => {
      this.showTimeoutMessage = true;
    }, 10000);
  }

  closePreviewModal() {
    this.isModalOpen = false;
    this.showTimeoutMessage = false;
    if (this.previewTimeoutId) {
      clearTimeout(this.previewTimeoutId);
    }
  }

  visitFullSite() {
    window.open('https://opusagency.it/', '_blank');
    this.closePreviewModal();
  }
}
