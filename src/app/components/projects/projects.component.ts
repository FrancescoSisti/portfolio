import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { LazyLoadDirective } from '../../directives/lazy-load.directive';
import { ImageService, ImageTypes } from '../../services/image.service';

interface Project {
  title: string;
  type: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  status?: 'completed' | 'in-progress' | 'planned';
  imageUrl?: string;
  imageAlt?: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, LazyLoadDirective]
})
export class ProjectsComponent implements OnInit {
  @ViewChild('previewIframe') previewIframe!: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private meta: Meta,
    private imageService: ImageService
  ) {
    this.opusPreviewUrl = this.getSafeUrl('https://opusagency.it');
    this.initializeProjectImages();
  }

  private initializeProjectImages() {
    this.featuredProjects = this.featuredProjects.map(project => ({
      ...project,
      imageUrl: project.imageUrl ? this.imageService.getOptimizedImageUrl(project.imageUrl, 'project-preview') : undefined,
      dimensions: this.imageService.getImageDimensions('project-preview')
    }));

    this.otherProjects = this.otherProjects.map(project => ({
      ...project,
      imageUrl: project.imageUrl ? this.imageService.getOptimizedImageUrl(project.imageUrl, 'project-thumbnail') : undefined,
      dimensions: this.imageService.getImageDimensions('project-thumbnail')
    }));
  }

  isModalOpen = false;
  showTimeoutMessage = false;
  opusPreviewUrl: SafeResourceUrl;
  private previewTimeoutId: any;

  featuredProjects: Project[] = [
    {
      title: 'Opus Agency Website',
      type: 'Full Stack Development',
      description: 'Sito web aziendale moderno con design personalizzato, ottimizzazione SEO e interfaccia utente reattiva. Realizzato completamente da zero con tecnologie all\'avanguardia.',
      liveUrl: 'https://opusagency.it/',
      technologies: ['Angular', 'TypeScript', 'SCSS', 'SEO', 'Responsive Design'],
      status: 'completed',
      imageUrl: '/assets/images/projects/opus-preview.jpg',
      imageAlt: 'Anteprima del sito web Opus Agency'
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

  otherProjects: Project[] = [
    {
      title: 'E-commerce Platform',
      type: 'Full Stack Development',
      description: 'Piattaforma e-commerce completa con gestione prodotti e pagamenti.',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
      status: 'in-progress',
      imageUrl: '/assets/images/projects/ecommerce-preview.jpg',
      imageAlt: 'Anteprima della piattaforma e-commerce'
    },
    {
      title: 'Task Management System',
      type: 'Web Application',
      description: 'Sistema di gestione attività con funzionalità collaborative.',
      technologies: ['React', 'Firebase', 'Material UI'],
      status: 'planned',
      imageUrl: '/assets/images/projects/task-preview.jpg',
      imageAlt: 'Anteprima del sistema di gestione attività'
    },
    {
      title: 'Laravel API',
      type: 'Backend Development',
      description: 'API RESTful per la gestione di dati e autenticazione.',
      githubUrl: 'https://github.com/FrancescoSisti/laravel-api',
      technologies: ['Laravel', 'API', 'PHP'],
      status: 'completed',
      imageUrl: '/assets/images/projects/api-preview.jpg',
      imageAlt: 'Anteprima della documentazione API'
    },
    {
      title: 'Vite Boolfolio',
      type: 'Frontend Development',
      description: 'Portfolio dinamico costruito con Vite e Vue.js.',
      githubUrl: 'https://github.com/FrancescoSisti/vite-boolfolio',
      technologies: ['Vue.js', 'Vite', 'JavaScript'],
      status: 'completed',
      imageUrl: '/assets/images/projects/portfolio-preview.jpg',
      imageAlt: 'Anteprima del portfolio Vite'
    },
    {
      title: 'CRM System',
      type: 'Full Stack Development',
      description: 'Sistema di gestione clienti con analisi dati e reporting.',
      technologies: ['Angular', 'Node.js', 'PostgreSQL'],
      status: 'planned',
      imageUrl: '/assets/images/projects/crm-preview.jpg',
      imageAlt: 'Anteprima del sistema CRM'
    },
    {
      title: 'Mobile App',
      type: 'Mobile Development',
      description: 'Applicazione mobile per la gestione personale.',
      technologies: ['React Native', 'Firebase', 'Redux'],
      status: 'planned',
      imageUrl: '/assets/images/projects/mobile-preview.jpg',
      imageAlt: 'Anteprima dell\'applicazione mobile'
    }
  ];

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openPreviewModal() {
    this.isModalOpen = true;
    this.showTimeoutMessage = false;

    // Set timeout for 10 seconds
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

  ngOnInit() {
    this.addProjectsSchema();
    // Precarica l'immagine più grande per migliorare LCP
    if (this.featuredProjects[0]?.imageUrl) {
      const img = new Image();
      img.src = this.featuredProjects[0].imageUrl;
    }
  }

  private addProjectsSchema() {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListElement': [
        {
          '@type': 'WebSite',
          'position': 1,
          'name': 'Opus Agency Website',
          'description': 'Sito web aziendale moderno con design personalizzato, ottimizzazione SEO e interfaccia utente reattiva',
          'url': 'https://opusagency.it/',
          'author': {
            '@type': 'Person',
            '@id': 'https://francescosisti.com/#person'
          }
        }
        // Puoi aggiungere altri progetti qui seguendo lo stesso formato
      ]
    };

    // Aggiungi lo schema al DOM
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
