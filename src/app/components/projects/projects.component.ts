import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ProjectsService, Project as AdminProject } from '../../services/projects.service';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  images?: string[];  // Array of additional images for the carousel
  year: string;
  category: string;
  status: string;
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
  activeCategory: string = 'all';
  activeImageIndex: { [key: string]: number } = {};
  currentImages: { [key: string]: string } = {};
  hasError: { [key: string]: boolean } = {};

  // Modal properties
  isModalOpen = false;
  modalImage: string | null = null;
  modalProject: Project | null = null;

  projects: Project[] = [];

  constructor(private projectsService: ProjectsService) {
    this.initializeImages();
  }

  private initializeImages(): void {
    if (!this.projects || this.projects.length === 0) {
      return;
    }

    this.projects.forEach(project => {
      if (!project || !project.title) return;

      this.currentImages[project.title] = project.image;
      this.activeImageIndex[project.title] = 0;
      this.hasError[project.title] = false;

      if (project.image) {
        const img = new Image();
        img.src = project.image;
        img.onerror = () => {
          if (project.status === 'coming-soon' || !project.status) {
            this.currentImages[project.title] = this.DEFAULT_IMAGE;
          }
        };
      } else {
        this.currentImages[project.title] = this.DEFAULT_IMAGE;
      }
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

  setCategory(category: string): void {
    this.activeCategory = category;
    if (category === 'all') {
      this.loadProjects();
    } else {
      this.projectsService.getProjectsByCategory(category).subscribe(adminProjects => {
        this.projects = this.mapAdminProjectsToFrontend(adminProjects);
      });
    }
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
      'TypeScript': 'fas fa-code',
      'JavaScript': 'fab fa-js',
      'HTML': 'fab fa-html5',
      'CSS': 'fab fa-css3-alt',
      'SCSS': 'fab fa-sass',
      'Node.js': 'fab fa-node-js',
      'Express': 'fas fa-server',
      'PHP': 'fab fa-php',
      'Laravel': 'fab fa-laravel',
      'MySQL': 'fas fa-database',
      'MongoDB': 'fas fa-database',
      'Firebase': 'fas fa-fire',
      'TailwindCSS': 'fab fa-css3',
      'Bootstrap': 'fab fa-bootstrap',
      'Gsap': 'fas fa-magic',
      'AI': 'fas fa-robot',
      'API': 'fas fa-plug',
      'SEO': 'fas fa-search',
      'NLP': 'fas fa-language'
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
    this.loadProjects();
  }

  loadProjects() {
    this.projectsService.getAllProjects().subscribe(adminProjects => {
      // Converte i progetti dal formato dell'area amministrativa al formato utilizzato dal frontend
      this.projects = this.mapAdminProjectsToFrontend(adminProjects);
    });
  }

  mapAdminProjectsToFrontend(adminProjects: AdminProject[]): Project[] {
    return adminProjects.map(p => {
      // Mappa le tecnologie al formato dello stack
      const technologies = Array.isArray(p.technologies) ? p.technologies : [];
      const stack = technologies.map(tech => {
        return {
          name: tech,
          color: this.getTechColor(tech)
        };
      });

      // Gestione della data di creazione
      let year = 'N/A';
      try {
        if (p.createdAt) {
          const date = p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt);
          year = isNaN(date.getTime()) ? 'N/A' : date.getFullYear().toString();
        }
      } catch (error) {
        console.error('Errore nel parsing della data di creazione:', error);
      }

      // Assicurati che l'URL dell'immagine sia valido
      const imageUrl = p.imageUrl && p.imageUrl.trim() !== ''
        ? p.imageUrl
        : this.DEFAULT_IMAGE;

      return {
        title: p.title || 'Progetto senza titolo',
        subtitle: p.title || 'Progetto', // Fallback per il sottotitolo
        description: p.description || 'Nessuna descrizione disponibile',
        image: imageUrl,
        year: year,
        category: p.category || 'web',
        status: p.status || 'completed',
        featured: !!p.featured,
        stack: stack.length > 0 ? stack : [{ name: 'Altre tecnologie', color: '#64748B' }],
        links: {
          live: p.liveUrl || undefined,
          github: p.githubUrl || undefined,
          preview: undefined
        }
      };
    });
  }

  getTechColor(tech: string): string {
    // Associa tecnologie a colori specifici
    const colors: { [key: string]: string } = {
      'Angular': '#DD0031',
      'React': '#61DAFB',
      'Vue.js': '#42B883',
      'TypeScript': '#3178C6',
      'JavaScript': '#F7DF1E',
      'HTML': '#E34F26',
      'CSS': '#1572B6',
      'SCSS': '#CC6699',
      'Node.js': '#339933',
      'Express': '#000000',
      'PHP': '#777BB4',
      'Laravel': '#FF2D20',
      'MySQL': '#4479A1',
      'MongoDB': '#47A248',
      'Firebase': '#FFCA28',
      'TailwindCSS': '#06B6D4',
      'Bootstrap': '#7952B3',
      'Gsap': '#88CE02',
      'AI': '#3498db',
      'API': '#9333ea',
      'SEO': '#10b981',
      'NLP': '#6366f1'
    };

    return colors[tech] || '#64748B'; // Colore predefinito per tecnologie sconosciute
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
