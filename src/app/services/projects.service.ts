import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: string; // Web, App, AI, etc.
  status?: string; // completed, in-progress, planned
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  private nextId = 1;
  private readonly STORAGE_KEY = 'portfolio_projects';

  constructor() {
    // Prova a caricare i progetti dal localStorage
    this.loadProjects();
  }

  private loadProjects(): void {
    try {
      const storedProjects = localStorage.getItem(this.STORAGE_KEY);

      if (storedProjects) {
        // Converte le date da stringhe a oggetti Date
        const projects = JSON.parse(storedProjects, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });

        this.projectsSubject.next(projects);

        // Imposta nextId al valore massimo + 1
        if (projects.length > 0) {
          this.nextId = Math.max(...projects.map((p: Project) => p.id)) + 1;
        }
      } else {
        // Se non ci sono progetti salvati, carica quelli predefiniti
        this.loadRealProjects();
      }
    } catch (error) {
      console.error('Errore nel caricamento dei progetti:', error);
      this.loadRealProjects(); // Fallback ai progetti predefiniti
    }
  }

  private saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Errore nel salvataggio dei progetti:', error);
    }
  }

  private loadRealProjects(): void {
    const realProjects: Project[] = [
      {
        id: this.nextId++,
        title: 'Portfolio personale',
        description: 'Il mio sito portfolio personale costruito con Angular.',
        technologies: ['Angular', 'TypeScript', 'SCSS', 'RxJS'],
        imageUrl: 'assets/images/projects/portfolio.jpg',
        githubUrl: 'https://github.com/FrancescoSisti/portfolio',
        liveUrl: 'https://francescosisti.com',
        featured: true,
        category: 'web',
        status: 'completed',
        createdAt: new Date('2023-09-15'),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        title: 'Opus Agency Website',
        description: 'Sito web aziendale con design moderno, animazioni fluide e ottimizzazione SEO. Focus sulla user experience e performance.',
        technologies: ['Angular', 'TypeScript', 'SCSS', 'Gsap'],
        imageUrl: '/assets/images/projects/opus.png',
        liveUrl: 'https://opusagency.it',
        featured: true,
        category: 'web',
        status: 'completed',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: this.nextId++,
        title: 'Studio Lory Website',
        description: 'Piattaforma moderna creata per la professionista della salute Loredana Vincenti con interfaccia reattiva, prenotazioni online e gestione contenuti.',
        technologies: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
        imageUrl: '/assets/images/projects/wellness.png',
        githubUrl: 'https://github.com/FrancescoSisti/wellness-website-2.0',
        featured: false,
        category: 'web',
        status: 'completed',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-03-10')
      },
      {
        id: this.nextId++,
        title: 'Laravel BDoctors',
        description: 'Piattaforma per la gestione di profili medici con sistema di prenotazione e dashboard amministrativa.',
        technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'API'],
        imageUrl: 'assets/images/projects/bdoctors.jpg',
        githubUrl: 'https://github.com/FrancescoSisti/laravel-bdoctors',
        featured: false,
        category: 'web',
        status: 'completed',
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2023-08-22')
      },
      {
        id: this.nextId++,
        title: 'Oracle Chatbot',
        description: 'Chatbot intelligente basato su AI per l\'assistenza clienti e automazione delle risposte.',
        technologies: ['PHP', 'AI', 'API Integration', 'NLP'],
        imageUrl: 'assets/images/projects/chatbot.jpg',
        githubUrl: 'https://github.com/FrancescoSisti/oracle-chatbot',
        featured: false,
        category: 'ai',
        status: 'completed',
        createdAt: new Date('2022-12-05'),
        updatedAt: new Date('2023-03-18')
      }
    ];

    this.projectsSubject.next(realProjects);
    this.saveProjects(realProjects); // Salva i progetti predefiniti nel localStorage
  }

  // CRUD Operations

  getAllProjects(): Observable<Project[]> {
    return this.projects$;
  }

  getProjectById(id: number): Observable<Project | undefined> {
    const projects = this.projectsSubject.value;
    const project = projects.find(p => p.id === id);
    return of(project).pipe(delay(300)); // Simulare latenza di rete
  }

  getFeaturedProjects(): Observable<Project[]> {
    const projects = this.projectsSubject.value;
    const featuredProjects = projects.filter(p => p.featured);
    return of(featuredProjects).pipe(delay(300));
  }

  getProjectsByCategory(category: string): Observable<Project[]> {
    const projects = this.projectsSubject.value;
    const categoryProjects = category === 'all'
      ? projects
      : projects.filter(p => p.category === category);
    return of(categoryProjects).pipe(delay(300));
  }

  addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    const projects = this.projectsSubject.value;

    const newProject: Project = {
      ...project,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProjects = [...projects, newProject];
    this.projectsSubject.next(updatedProjects);
    this.saveProjects(updatedProjects);

    return of(newProject).pipe(delay(500));
  }

  updateProject(updatedProject: Project): Observable<Project> {
    const projects = this.projectsSubject.value;
    const index = projects.findIndex(p => p.id === updatedProject.id);

    if (index === -1) {
      return of({
        ...updatedProject,
        updatedAt: new Date()
      }).pipe(delay(500));
    }

    const newProject = {
      ...updatedProject,
      updatedAt: new Date()
    };

    const updatedProjects = [
      ...projects.slice(0, index),
      newProject,
      ...projects.slice(index + 1)
    ];

    this.projectsSubject.next(updatedProjects);
    this.saveProjects(updatedProjects);

    return of(newProject).pipe(delay(500));
  }

  deleteProject(id: number): Observable<boolean> {
    const projects = this.projectsSubject.value;
    const updatedProjects = projects.filter(p => p.id !== id);

    this.projectsSubject.next(updatedProjects);
    this.saveProjects(updatedProjects);

    return of(true).pipe(delay(500));
  }

  toggleFeatured(id: number): Observable<Project | undefined> {
    const projects = this.projectsSubject.value;
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return of(undefined).pipe(delay(300));
    }

    const project = projects[index];
    const updatedProject = {
      ...project,
      featured: !project.featured,
      updatedAt: new Date()
    };

    const updatedProjects = [
      ...projects.slice(0, index),
      updatedProject,
      ...projects.slice(index + 1)
    ];

    this.projectsSubject.next(updatedProjects);
    this.saveProjects(updatedProjects);

    return of(updatedProject).pipe(delay(300));
  }

  // Metodo per ripristinare i progetti predefiniti
  resetToDefaultProjects(): Observable<boolean> {
    this.loadRealProjects();
    return of(true).pipe(delay(500));
  }
}
