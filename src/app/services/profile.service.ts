import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface ProfileContact {
  type: 'email' | 'phone' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'twitter' | 'other';
  value: string;
  url?: string;
  icon?: string;
  isPublic: boolean;
}

export interface ProfileEducation {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
}

export interface ProfileExperience {
  id: number;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
  technologies?: string[];
}

export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  summary: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  location?: string;
  birthDate?: Date;
  contacts: ProfileContact[];
  education: ProfileEducation[];
  experience: ProfileExperience[];
  availableForWork: boolean;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<Profile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  private nextEducationId = 1;
  private nextExperienceId = 1;

  constructor() {
    // Carica profilo simulato all'inizializzazione
    this.loadMockProfile();
  }

  private loadMockProfile(): void {
    const mockProfile: Profile = {
      id: 1,
      firstName: 'Marco',
      lastName: 'Rossi',
      title: 'Full Stack Developer',
      bio: 'Sviluppatore appassionato di tecnologie web moderne con esperienza in Angular, React e Node.js.',
      summary: 'Sviluppatore full stack con 5 anni di esperienza. Specializzato in applicazioni web responsive e performanti, con focus su Angular e React per il frontend e Node.js per il backend.',
      avatarUrl: 'assets/images/profile-avatar.jpg',
      coverImageUrl: 'assets/images/profile-cover.jpg',
      location: 'Milano, Italia',
      birthDate: new Date('1990-05-15'),
      contacts: [
        {
          type: 'email',
          value: 'marco.rossi@example.com',
          isPublic: true,
          icon: 'far fa-envelope'
        },
        {
          type: 'phone',
          value: '+39 123 456 7890',
          isPublic: false,
          icon: 'fas fa-phone'
        },
        {
          type: 'github',
          value: 'marcorossi',
          url: 'https://github.com/marcorossi',
          isPublic: true,
          icon: 'fab fa-github'
        },
        {
          type: 'linkedin',
          value: 'marco-rossi',
          url: 'https://linkedin.com/in/marco-rossi',
          isPublic: true,
          icon: 'fab fa-linkedin'
        }
      ],
      education: [
        {
          id: this.nextEducationId++,
          institution: 'Università degli Studi di Milano',
          degree: 'Laurea Magistrale',
          field: 'Informatica',
          startDate: new Date('2012-09-01'),
          endDate: new Date('2014-07-15'),
          description: 'Specializzazione in sviluppo di applicazioni web e mobile',
          location: 'Milano, Italia'
        },
        {
          id: this.nextEducationId++,
          institution: 'Università degli Studi di Milano',
          degree: 'Laurea Triennale',
          field: 'Informatica',
          startDate: new Date('2009-09-01'),
          endDate: new Date('2012-07-15'),
          description: 'Fondamenti di programmazione, algoritmi e strutture dati',
          location: 'Milano, Italia'
        }
      ],
      experience: [
        {
          id: this.nextExperienceId++,
          company: 'Tech Solutions Srl',
          position: 'Senior Frontend Developer',
          startDate: new Date('2020-01-01'),
          description: 'Sviluppo di applicazioni web con Angular e React. Implementazione di architetture frontend scalabili e performanti.',
          technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'SCSS'],
          location: 'Milano, Italia'
        },
        {
          id: this.nextExperienceId++,
          company: 'Digital Innovation Inc.',
          position: 'Full Stack Developer',
          startDate: new Date('2017-03-01'),
          endDate: new Date('2019-12-31'),
          description: 'Sviluppo di soluzioni web complete utilizzando MEAN stack. Implementazione di API RESTful e interfacce utente responsive.',
          technologies: ['Angular', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
          location: 'Milano, Italia'
        },
        {
          id: this.nextExperienceId++,
          company: 'WebStudio Agency',
          position: 'Frontend Developer',
          startDate: new Date('2015-06-01'),
          endDate: new Date('2017-02-28'),
          description: 'Progettazione e sviluppo di siti web responsivi per clienti vari.',
          technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap'],
          location: 'Milano, Italia'
        }
      ],
      availableForWork: true,
      updatedAt: new Date()
    };

    this.profileSubject.next(mockProfile);
  }

  // CRUD Operations

  getProfile(): Observable<Profile | null> {
    return this.profile$;
  }

  updateProfile(updatedProfile: Partial<Profile>): Observable<Profile> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const newProfile: Profile = {
      ...currentProfile,
      ...updatedProfile,
      updatedAt: new Date()
    };

    return of(newProfile).pipe(
      delay(500),
      tap(() => this.profileSubject.next(newProfile))
    );
  }

  // Education operations

  addEducation(education: Omit<ProfileEducation, 'id'>): Observable<ProfileEducation> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const newEducation: ProfileEducation = {
      ...education,
      id: this.nextEducationId++
    };

    const updatedProfile: Profile = {
      ...currentProfile,
      education: [...currentProfile.education, newEducation],
      updatedAt: new Date()
    };

    return of(newEducation).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  updateEducation(education: ProfileEducation): Observable<ProfileEducation> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const index = currentProfile.education.findIndex(e => e.id === education.id);

    if (index === -1) {
      throw new Error('Formazione non trovata');
    }

    const updatedEducation = [...currentProfile.education];
    updatedEducation[index] = education;

    const updatedProfile: Profile = {
      ...currentProfile,
      education: updatedEducation,
      updatedAt: new Date()
    };

    return of(education).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  deleteEducation(id: number): Observable<boolean> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const updatedEducation = currentProfile.education.filter(e => e.id !== id);

    if (updatedEducation.length === currentProfile.education.length) {
      return of(false).pipe(delay(300));
    }

    const updatedProfile: Profile = {
      ...currentProfile,
      education: updatedEducation,
      updatedAt: new Date()
    };

    return of(true).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  // Experience operations

  addExperience(experience: Omit<ProfileExperience, 'id'>): Observable<ProfileExperience> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const newExperience: ProfileExperience = {
      ...experience,
      id: this.nextExperienceId++
    };

    const updatedProfile: Profile = {
      ...currentProfile,
      experience: [...currentProfile.experience, newExperience],
      updatedAt: new Date()
    };

    return of(newExperience).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  updateExperience(experience: ProfileExperience): Observable<ProfileExperience> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const index = currentProfile.experience.findIndex(e => e.id === experience.id);

    if (index === -1) {
      throw new Error('Esperienza non trovata');
    }

    const updatedExperience = [...currentProfile.experience];
    updatedExperience[index] = experience;

    const updatedProfile: Profile = {
      ...currentProfile,
      experience: updatedExperience,
      updatedAt: new Date()
    };

    return of(experience).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  deleteExperience(id: number): Observable<boolean> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const updatedExperience = currentProfile.experience.filter(e => e.id !== id);

    if (updatedExperience.length === currentProfile.experience.length) {
      return of(false).pipe(delay(300));
    }

    const updatedProfile: Profile = {
      ...currentProfile,
      experience: updatedExperience,
      updatedAt: new Date()
    };

    return of(true).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  // Contact operations

  addContact(contact: ProfileContact): Observable<ProfileContact> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const updatedProfile: Profile = {
      ...currentProfile,
      contacts: [...currentProfile.contacts, contact],
      updatedAt: new Date()
    };

    return of(contact).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  updateContact(index: number, contact: ProfileContact): Observable<ProfileContact> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    if (index < 0 || index >= currentProfile.contacts.length) {
      throw new Error('Contatto non trovato');
    }

    const updatedContacts = [...currentProfile.contacts];
    updatedContacts[index] = contact;

    const updatedProfile: Profile = {
      ...currentProfile,
      contacts: updatedContacts,
      updatedAt: new Date()
    };

    return of(contact).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  deleteContact(index: number): Observable<boolean> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    if (index < 0 || index >= currentProfile.contacts.length) {
      return of(false).pipe(delay(300));
    }

    const updatedContacts = [
      ...currentProfile.contacts.slice(0, index),
      ...currentProfile.contacts.slice(index + 1)
    ];

    const updatedProfile: Profile = {
      ...currentProfile,
      contacts: updatedContacts,
      updatedAt: new Date()
    };

    return of(true).pipe(
      delay(500),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  toggleAvailableForWork(): Observable<boolean> {
    const currentProfile = this.profileSubject.value;

    if (!currentProfile) {
      throw new Error('Profilo non trovato');
    }

    const updatedProfile: Profile = {
      ...currentProfile,
      availableForWork: !currentProfile.availableForWork,
      updatedAt: new Date()
    };

    return of(updatedProfile.availableForWork).pipe(
      delay(300),
      tap(() => this.profileSubject.next(updatedProfile))
    );
  }

  getContactTypes(): Observable<{label: string, value: string, icon: string}[]> {
    const contactTypes = [
      { label: 'Email', value: 'email', icon: 'far fa-envelope' },
      { label: 'Telefono', value: 'phone', icon: 'fas fa-phone' },
      { label: 'LinkedIn', value: 'linkedin', icon: 'fab fa-linkedin' },
      { label: 'GitHub', value: 'github', icon: 'fab fa-github' },
      { label: 'Instagram', value: 'instagram', icon: 'fab fa-instagram' },
      { label: 'Facebook', value: 'facebook', icon: 'fab fa-facebook' },
      { label: 'Twitter', value: 'twitter', icon: 'fab fa-twitter' },
      { label: 'Altro', value: 'other', icon: 'fas fa-link' }
    ];

    return of(contactTypes).pipe(delay(100));
  }
}
