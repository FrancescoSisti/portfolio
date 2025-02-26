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
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  private nextId = 1;

  constructor() {
    // Carica progetti simulati all'inizializzazione
    this.loadMockProjects();
  }

  private loadMockProjects(): void {
    const mockProjects: Project[] = [
      {
        id: this.nextId++,
        title: 'Portfolio personale',
        description: 'Il mio sito portfolio personale costruito con Angular.',
        technologies: ['Angular', 'TypeScript', 'SCSS', 'RxJS'],
        imageUrl: 'assets/images/projects/portfolio.jpg',
        githubUrl: 'https://github.com/FrancescoSisti/portfolio',
        liveUrl: 'https://francescosisti.com',
        featured: true,
        createdAt: new Date('2023-09-15'),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        title: 'E-commerce Store',
        description: 'Piattaforma e-commerce con funzionalità di carrello e pagamento.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
        imageUrl: 'assets/images/projects/ecommerce.jpg',
        githubUrl: 'https://github.com/FrancescoSisti/ecommerce',
        featured: false,
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2023-08-22')
      },
      {
        id: this.nextId++,
        title: 'Weather App',
        description: 'Applicazione meteo che utilizza API esterne per mostrare le previsioni.',
        technologies: ['JavaScript', 'HTML', 'CSS', 'OpenWeatherAPI'],
        imageUrl: 'assets/images/projects/weather.jpg',
        liveUrl: 'https://weatherapp.francescosisti.com',
        featured: false,
        createdAt: new Date('2022-12-05'),
        updatedAt: new Date('2023-03-18')
      }
    ];

    this.projectsSubject.next(mockProjects);
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

  addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    const projects = this.projectsSubject.value;

    const newProject: Project = {
      ...project,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProjects = [...projects, newProject];

    return of(newProject).pipe(
      delay(500),
      tap(() => this.projectsSubject.next(updatedProjects))
    );
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

    return of(newProject).pipe(
      delay(500),
      tap(() => this.projectsSubject.next(updatedProjects))
    );
  }

  deleteProject(id: number): Observable<boolean> {
    const projects = this.projectsSubject.value;
    const updatedProjects = projects.filter(p => p.id !== id);

    return of(true).pipe(
      delay(500),
      tap(() => this.projectsSubject.next(updatedProjects))
    );
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

    return of(updatedProject).pipe(
      delay(300),
      tap(() => this.projectsSubject.next(updatedProjects))
    );
  }
}
