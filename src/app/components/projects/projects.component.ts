import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
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
  activeCategory: 'all' | 'web' | 'app' | 'ai' = 'all';
  projects: Project[] = [
    {
      title: 'Opus Agency',
      subtitle: 'Digital Agency Website',
      description: 'Sito web aziendale con design moderno, animazioni fluide e ottimizzazione SEO. Focus sulla user experience e performance.',
      image: '/assets/images/projects/opus.jpg',
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
      title: 'BDoctors',
      subtitle: 'Healthcare Platform',
      description: 'Piattaforma avanzata per la gestione di profili medici con sistema di prenotazione integrato e dashboard analytics.',
      image: '/assets/images/projects/bdoctors.jpg',
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
      image: '/assets/images/projects/chatbot.jpg',
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
      image: '/assets/images/projects/ecommerce.jpg',
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

  ngOnInit(): void {
    // Preload featured project video if exists
    if (this.featuredProject?.links.preview) {
      const video = new Image();
      video.src = this.featuredProject.links.preview;
    }
  }
}
