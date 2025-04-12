import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface Skill {
  id: number;
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'design' | 'tools' | 'other';
  level: number; // da 1 a 5
  description?: string;
  featured: boolean;
  yearsExperience: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillCategory = 'frontend' | 'backend' | 'design' | 'tools' | 'other';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private skillsSubject = new BehaviorSubject<Skill[]>([]);
  public skills$ = this.skillsSubject.asObservable();

  private nextId = 1;

  constructor() {
    // Carica skills simulate all'inizializzazione
    this.loadMockSkills();
  }

  private loadMockSkills(): void {
    const mockSkills: Skill[] = [
      {
        id: this.nextId++,
        name: 'Angular',
        icon: 'fab fa-angular',
        category: 'frontend',
        level: 5,
        description: 'Sviluppo di SPA complesse e applicazioni enterprise.',
        featured: true,
        yearsExperience: 3,
        createdAt: new Date('2022-01-15'),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'React',
        icon: 'fab fa-react',
        category: 'frontend',
        level: 4,
        description: 'Sviluppo di interfacce utente reattive e componenti riutilizzabili.',
        featured: true,
        yearsExperience: 2,
        createdAt: new Date('2022-02-10'),
        updatedAt: new Date('2023-04-22')
      },
      {
        id: this.nextId++,
        name: 'Node.js',
        icon: 'fab fa-node-js',
        category: 'backend',
        level: 4,
        description: 'Sviluppo di API RESTful e servizi backend.',
        featured: true,
        yearsExperience: 2,
        createdAt: new Date('2022-03-05'),
        updatedAt: new Date('2023-01-18')
      },
      {
        id: this.nextId++,
        name: 'TypeScript',
        icon: 'fab fa-js',
        category: 'frontend',
        level: 5,
        description: 'Utilizzo avanzato di TypeScript per progetti frontend e backend.',
        featured: true,
        yearsExperience: 3,
        createdAt: new Date('2022-01-15'),
        updatedAt: new Date()
      },
      {
        id: this.nextId++,
        name: 'SASS/SCSS',
        icon: 'fab fa-sass',
        category: 'frontend',
        level: 4,
        description: 'Creazione di stili complessi con variabili, mixin e nesting.',
        featured: false,
        yearsExperience: 4,
        createdAt: new Date('2022-02-20'),
        updatedAt: new Date('2022-11-12')
      },
      {
        id: this.nextId++,
        name: 'Figma',
        icon: 'fab fa-figma',
        category: 'design',
        level: 3,
        description: 'Design di interfacce e prototipazione.',
        featured: false,
        yearsExperience: 2,
        createdAt: new Date('2022-05-10'),
        updatedAt: new Date('2023-02-28')
      },
      {
        id: this.nextId++,
        name: 'Git',
        icon: 'fab fa-git-alt',
        category: 'tools',
        level: 4,
        description: 'Controllo versione e collaborazione su progetti.',
        featured: false,
        yearsExperience: 5,
        createdAt: new Date('2022-01-10'),
        updatedAt: new Date('2022-09-15')
      }
    ];

    this.skillsSubject.next(mockSkills);
  }

  // CRUD Operations

  getAllSkills(): Observable<Skill[]> {
    return this.skills$;
  }

  getSkillById(id: number): Observable<Skill | undefined> {
    const skills = this.skillsSubject.value;
    const skill = skills.find(s => s.id === id);
    return of(skill).pipe(delay(300)); // Simulare latenza di rete
  }

  getSkillsByCategory(category: SkillCategory): Observable<Skill[]> {
    const skills = this.skillsSubject.value;
    const filteredSkills = skills.filter(s => s.category === category);
    return of(filteredSkills).pipe(delay(300));
  }

  getFeaturedSkills(): Observable<Skill[]> {
    const skills = this.skillsSubject.value;
    const featuredSkills = skills.filter(s => s.featured);
    return of(featuredSkills).pipe(delay(300));
  }

  addSkill(skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>): Observable<Skill> {
    const skills = this.skillsSubject.value;

    const newSkill: Skill = {
      ...skill,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedSkills = [...skills, newSkill];

    return of(newSkill).pipe(
      delay(500),
      tap(() => this.skillsSubject.next(updatedSkills))
    );
  }

  updateSkill(updatedSkill: Skill): Observable<Skill> {
    const skills = this.skillsSubject.value;
    const index = skills.findIndex(s => s.id === updatedSkill.id);

    if (index === -1) {
      return of({
        ...updatedSkill,
        updatedAt: new Date()
      }).pipe(delay(500));
    }

    const newSkill = {
      ...updatedSkill,
      updatedAt: new Date()
    };

    const updatedSkills = [
      ...skills.slice(0, index),
      newSkill,
      ...skills.slice(index + 1)
    ];

    return of(newSkill).pipe(
      delay(500),
      tap(() => this.skillsSubject.next(updatedSkills))
    );
  }

  deleteSkill(id: number): Observable<boolean> {
    const skills = this.skillsSubject.value;
    const updatedSkills = skills.filter(s => s.id !== id);

    return of(true).pipe(
      delay(500),
      tap(() => this.skillsSubject.next(updatedSkills))
    );
  }

  toggleFeatured(id: number): Observable<Skill | undefined> {
    const skills = this.skillsSubject.value;
    const index = skills.findIndex(s => s.id === id);

    if (index === -1) {
      return of(undefined).pipe(delay(300));
    }

    const skill = skills[index];
    const updatedSkill = {
      ...skill,
      featured: !skill.featured,
      updatedAt: new Date()
    };

    const updatedSkills = [
      ...skills.slice(0, index),
      updatedSkill,
      ...skills.slice(index + 1)
    ];

    return of(updatedSkill).pipe(
      delay(300),
      tap(() => this.skillsSubject.next(updatedSkills))
    );
  }

  getSkillCategories(): Observable<{label: string, value: SkillCategory}[]> {
    const categories = [
      { label: 'Frontend', value: 'frontend' as SkillCategory },
      { label: 'Backend', value: 'backend' as SkillCategory },
      { label: 'Design', value: 'design' as SkillCategory },
      { label: 'Tools', value: 'tools' as SkillCategory },
      { label: 'Other', value: 'other' as SkillCategory }
    ];

    return of(categories).pipe(delay(100));
  }
}
