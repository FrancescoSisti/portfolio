import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  images?: string[];  // Array of additional images for the carousel
  year: string;
  category: 'web' | 'app' | 'ai';
  status: 'completed' | 'coming-soon';
  stack: {
    name: string;
    color: string;
  }[];
  links: {
    github?: string;
    live?: string;
    preview?: string;
  };
  featured?: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerFade', [
      transition(':enter', [
        query('.project-card', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('0.8s cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ProjectsComponent implements OnInit {
  readonly DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiM4ODg4ODgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbWluZyBTb29uPC90ZXh0Pjwvc3ZnPg==';
  activeCategory: 'all' | 'web' | 'app' | 'ai' = 'all';
  activeImageIndex: { [key: string]: number } = {};
  currentImages: { [key: string]: string } = {};
  hasError: { [key: string]: boolean } = {};

  // Modal properties
  isModalOpen = false;
  modalImage: string | null = null;
  modalProject: Project | null = null;

  projects: Project[] = [
    {
      title: 'Opus Agency Website',
      subtitle: 'Digital Agency Website',
      description: 'Sito web aziendale con design moderno, animazioni fluide e ottimizzazione SEO. Focus sulla user experience e performance.',
      image: '/assets/images/projects/opus.png',
      images: ['/assets/images/projects/opus-2.png', '/assets/images/projects/opus-3.png'],
      year: '2024',
      category: 'web',
      status: 'completed',
      featured: true,
      stack: [
        { name: 'Angular', color: '#DD0031' },
        { name: 'TypeScript', color: '#3178C6' },
        { name: 'SCSS', color: '#CC6699' },
        { name: 'Gsap', color: '#88CE02' }
      ],
      links: {
        live: 'https://opusagency.it',
        preview: '/assets/videos/opus-preview.mp4'
      }
    },
    {
      title: 'Studio Lory Website',
      subtitle: 'Health & Wellness Platform',
      description: 'Piattaforma moderna creata per la professionista della salute Loredana Vincenti con interfaccia reattiva, prenotazioni online e gestione contenuti.',
      image: '/assets/images/projects/wellness.png',
      images: [
        '/assets/images/projects/wellness-2.png',
        '/assets/images/projects/wellness-3.png',
        '/assets/images/projects/wellness-4.png'
      ],
      year: '2024',
      category: 'web',
      status: 'completed',
      stack: [
        { name: 'React', color: '#61DAFB' },
        { name: 'Node.js', color: '#339933' },
        { name: 'MongoDB', color: '#47A248' },
        { name: 'TailwindCSS', color: '#06B6D4' }
      ],
      links: {
        github: 'https://github.com/FrancescoSisti/wellness-website-2.0'
      }
    },
    {
      title: 'BDoctors',
      subtitle: 'Healthcare Platform',
      description: 'Piattaforma avanzata per la gestione di profili medici con sistema di prenotazione integrato e dashboard analytics.',
      image: '/assets/images/projects/bdoctors.png',
      images: ['/assets/images/projects/bdoctors-2.png', '/assets/images/projects/bdoctors-3.png'],
      year: '2023',
      category: 'web',
      status: 'completed',
      stack: [
        { name: 'Laravel', color: '#FF2D20' },
        { name: 'MySQL', color: '#4479A1' },
        { name: 'Vue.js', color: '#4FC08D' },
        { name: 'TailwindCSS', color: '#06B6D4' }
      ],
      links: {
        github: 'https://github.com/FrancescoSisti/laravel-bdoctors'
      }
    },
    {
      title: 'AI Assistant',
      subtitle: 'Intelligent Chatbot',
      description: 'Chatbot AI avanzato con NLP per l\'assistenza clienti, integrazione con multiple piattaforme e analisi del sentiment.',
      image: '/assets/images/projects/chatbot.png',
      images: ['/assets/images/projects/chatbot-2.png', '/assets/images/projects/chatbot-3.png'],
      year: '2023',
      category: 'ai',
      status: 'coming-soon',
      stack: [
        { name: 'Python', color: '#3776AB' },
        { name: 'TensorFlow', color: '#FF6F00' },
        { name: 'Node.js', color: '#339933' },
        { name: 'MongoDB', color: '#47A248' }
      ],
      links: {}
    },
    {
      title: 'E-commerce Platform',
      subtitle: 'Full Stack Store',
      description: 'Piattaforma e-commerce completa con gestione prodotti, pagamenti Stripe e analytics avanzate.',
      image: '/assets/images/projects/ecommerce.png',
      images: ['/assets/images/projects/ecommerce-2.png', '/assets/images/projects/ecommerce-3.png'],
      year: '2023',
      category: 'web',
      status: 'coming-soon',
      stack: [
        { name: 'Angular', color: '#DD0031' },
        { name: 'Node.js', color: '#339933' },
        { name: 'MongoDB', color: '#47A248' },
        { name: 'Stripe', color: '#008CDD' }
      ],
      links: {}
    }
  ];

  constructor() {
    this.initializeImages();
  }

  private initializeImages(): void {
    this.projects.forEach(project => {
      this.currentImages[project.title] = project.image;
      this.activeImageIndex[project.title] = 0;
      this.hasError[project.title] = false;

      const img = new Image();
      img.src = project.image;
      img.onerror = () => {
        if (project.status === 'coming-soon') {
          this.currentImages[project.title] = this.DEFAULT_IMAGE;
        }
      };
    });
  }

  get filteredProjects(): Project[] {
    return this.projects.filter(project =>
      this.activeCategory === 'all' || project.category === this.activeCategory
    );
  }

  get featuredProject(): Project | undefined {
    return this.projects.find(p => p.featured);
  }

  setCategory(category: 'all' | 'web' | 'app' | 'ai'): void {
    this.activeCategory = category;
  }

  getProjectClasses(project: Project): string[] {
    const classes = ['project'];
    if (project.featured) classes.push('featured');
    return classes;
  }

  getTechIcon(tech: string): string {
    const icons: { [key: string]: string } = {
      'Angular': 'fab fa-angular',
      'React': 'fab fa-react',
      'Vue.js': 'fab fa-vuejs',
      'Node.js': 'fab fa-node-js',
      'PHP': 'fab fa-php',
      'Laravel': 'fab fa-laravel',
      'Python': 'fab fa-python',
      'TypeScript': 'fas fa-code',
      'JavaScript': 'fab fa-js',
      'MongoDB': 'fas fa-database',
      'MySQL': 'fas fa-database',
      'PostgreSQL': 'fas fa-database',
      'Firebase': 'fas fa-fire',
      'Stripe': 'fab fa-stripe',
      'TailwindCSS': 'fas fa-wind',
      'SCSS': 'fab fa-sass',
      'Gsap': 'fas fa-magic',
      'TensorFlow': 'fas fa-brain'
    };
    return icons[tech] || 'fas fa-code';
  }

  nextImage(project: Project): void {
    if (!project.images?.length) return;

    const maxIndex = project.images.length;
    const currentIndex = this.activeImageIndex[project.title] || 0;
    const nextIndex = (currentIndex + 1) % (maxIndex + 1);

    this.activeImageIndex[project.title] = nextIndex;
    this.updateCurrentImage(project, nextIndex);
  }

  prevImage(project: Project): void {
    if (!project.images?.length) return;

    const maxIndex = project.images.length;
    const currentIndex = this.activeImageIndex[project.title] || 0;
    const prevIndex = currentIndex === 0 ? maxIndex : currentIndex - 1;

    this.activeImageIndex[project.title] = prevIndex;
    this.updateCurrentImage(project, prevIndex);
  }

  private updateCurrentImage(project: Project, index: number): void {
    if (this.hasError[project.title]) {
      this.currentImages[project.title] = this.DEFAULT_IMAGE;
      return;
    }

    this.currentImages[project.title] = index === 0
      ? project.image
      : project.images![index - 1];
  }

  getCurrentImage(project: Project): string {
    return this.currentImages[project.title] || this.DEFAULT_IMAGE;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img) return;

    const projectTitle = this.findProjectTitleFromImage(img.src);
    if (!projectTitle) return;

    const project = this.projects.find(p => p.title === projectTitle);
    if (!project) return;

    if (img.src === project.image && project.images?.length) {
      this.currentImages[projectTitle] = project.images[0];
    } else {
      this.hasError[projectTitle] = true;
      this.currentImages[projectTitle] = this.DEFAULT_IMAGE;
    }
  }

  handleImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img) return;

    const projectTitle = this.findProjectTitleFromImage(img.src);
    if (projectTitle) {
      this.hasError[projectTitle] = false;
    }

    requestAnimationFrame(() => {
      img.classList.remove('loaded');
      void img.offsetWidth;
      img.classList.add('loaded');
    });
  }

  private findProjectTitleFromImage(src: string): string | null {
    const cleanSrc = src.split('?')[0];
    return this.projects.find(project =>
      project.image === cleanSrc || project.images?.includes(cleanSrc)
    )?.title || null;
  }

  ngOnInit(): void {
    if (this.featuredProject?.links.preview) {
      const video = new Image();
      video.src = this.featuredProject.links.preview;
    }
  }

  openImageModal(project: Project, image: string): void {
    this.modalProject = project;
    this.modalImage = image;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalImage = null;
    this.modalProject = null;
    document.body.style.overflow = '';
  }

  nextModalImage(): void {
    if (!this.modalProject || !this.modalProject.images?.length) return;

    const currentSrc = this.modalImage;
    const images = [this.modalProject.image, ...this.modalProject.images];
    const currentIndex = images.findIndex(img => img === currentSrc);
    const nextIndex = (currentIndex + 1) % images.length;

    this.modalImage = images[nextIndex];
  }

  prevModalImage(): void {
    if (!this.modalProject || !this.modalProject.images?.length) return;

    const currentSrc = this.modalImage;
    const images = [this.modalProject.image, ...this.modalProject.images];
    const currentIndex = images.findIndex(img => img === currentSrc);
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;

    this.modalImage = images[prevIndex];
  }
}
