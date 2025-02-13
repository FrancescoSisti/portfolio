import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Commit {
  hash: string;
  date: string;
  message: string;
  type: 'feature' | 'fix' | 'improvement' | 'docs' | 'refactor' | 'style' | 'test' | 'chore';
  description?: string;
  breaking?: boolean;
}

export interface Version {
  version: string;
  date: string;
  name?: string;
  description?: string;
  commits: Commit[];
}

export interface PaginatedVersions {
  versions: Version[];
  total: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {
  private readonly PAGE_SIZE = 3;
  private versions: Version[] = [
    {
      version: '1.2.0',
      date: '2024-03-20',
      name: 'Legal Update',
      description: 'Aggiornamento completo della documentazione legale e miglioramenti alla sicurezza',
      commits: [
        {
          hash: 'a1b2c3d',
          date: '2024-03-20',
          type: 'docs',
          message: 'Aggiornamento completo Privacy Policy e Terms of Service',
          description: 'Implementazione di documenti legali completi conformi al GDPR e alla normativa italiana'
        },
        {
          hash: 'b2c3d4e',
          date: '2024-03-20',
          type: 'feature',
          message: 'Implementazione Cookie Banner avanzato',
          description: 'Nuovo sistema di gestione dei consensi cookie con preferenze granulari'
        },
        {
          hash: 'c3d4e5f',
          date: '2024-03-19',
          type: 'improvement',
          message: 'Miglioramento sicurezza form di contatto',
          description: 'Implementazione reCAPTCHA e validazione avanzata input'
        }
      ]
    },
    {
      version: '1.1.0',
      date: '2024-03-01',
      name: 'Performance Update',
      description: 'Miglioramenti significativi alle performance e all\'accessibilità',
      commits: [
        {
          hash: 'd4e5f6g',
          date: '2024-03-01',
          type: 'improvement',
          message: 'Ottimizzazione caricamento immagini',
          description: 'Implementazione lazy loading e formati next-gen'
        },
        {
          hash: 'e5f6g7h',
          date: '2024-02-28',
          type: 'feature',
          message: 'Implementazione PWA',
          description: 'Aggiunta funzionalità Progressive Web App'
        },
        {
          hash: 'f6g7h8i',
          date: '2024-02-27',
          type: 'improvement',
          message: 'Miglioramenti accessibilità WCAG 2.1',
          description: 'Implementazione ARIA labels e miglioramenti contrasto'
        }
      ]
    },
    {
      version: '1.0.0',
      date: '2024-02-10',
      name: 'Initial Release',
      description: 'Prima release pubblica del portfolio',
      commits: [
        {
          hash: '5a52041',
          date: '2024-02-10',
          type: 'feature',
          message: 'Implementazione Projects View Mobile-First',
          description: 'Nuova visualizzazione progetti ottimizzata per mobile'
        },
        {
          hash: '364ce0b',
          date: '2024-02-10',
          type: 'improvement',
          message: 'Miglioramento Navbar Mobile',
          description: 'Pattern di design ispirati a iOS per una migliore UX mobile'
        },
        {
          hash: 'g7h8i9j',
          date: '2024-02-09',
          type: 'feature',
          message: 'Sistema di temi dinamico',
          description: 'Implementazione dark/light mode con preferenze utente'
        }
      ]
    },
    {
      version: '0.2.0',
      date: '2024-02-03',
      name: 'Beta Release',
      description: 'Versione beta con funzionalità core',
      commits: [
        {
          hash: 'f9049fb',
          date: '2024-02-03',
          type: 'feature',
          message: 'Preview Progetti Interattive',
          description: 'Nuove animazioni e interazioni per le preview dei progetti'
        },
        {
          hash: '1e30f18',
          date: '2024-02-03',
          type: 'feature',
          message: 'Vista Skills Interattiva',
          description: 'Implementazione visualizzazione competenze con filtri dinamici'
        },
        {
          hash: 'h8i9j0k',
          date: '2024-02-02',
          type: 'improvement',
          message: 'Ottimizzazione SEO',
          description: 'Implementazione meta tag dinamici e sitemap'
        }
      ]
    },
    {
      version: '0.1.0',
      date: '2024-01-15',
      name: 'Alpha Release',
      description: 'Prima versione alpha del portfolio',
      commits: [
        {
          hash: '46b0bfe',
          date: '2024-01-15',
          type: 'feature',
          message: 'Setup Iniziale Portfolio',
          description: 'Configurazione progetto Angular e architettura base'
        },
        {
          hash: '3282a71',
          date: '2024-01-15',
          type: 'feature',
          message: 'Struttura Base e Navigazione',
          description: 'Implementazione routing e componenti principali'
        },
        {
          hash: 'i9j0k1l',
          date: '2024-01-14',
          type: 'chore',
          message: 'Setup Ambiente di Sviluppo',
          description: 'Configurazione tooling e pipeline CI/CD'
        }
      ]
    }
  ];

  constructor() { }

  getVersions(page: number = 1): Observable<PaginatedVersions> {
    const start = (page - 1) * this.PAGE_SIZE;
    const end = start + this.PAGE_SIZE;
    const paginatedVersions = this.versions.slice(start, end);

    return of({
      versions: paginatedVersions,
      total: this.versions.length,
      hasMore: end < this.versions.length
    });
  }

  getLatestVersion(): Observable<Version> {
    return of(this.versions[0]);
  }

  getVersionByNumber(version: string): Observable<Version | undefined> {
    return of(this.versions.find(v => v.version === version));
  }

  searchVersions(query: string): Observable<Version[]> {
    const lowercaseQuery = query.toLowerCase();
    return of(this.versions).pipe(
      map(versions => versions.filter(version =>
        version.version.toLowerCase().includes(lowercaseQuery) ||
        version.name?.toLowerCase().includes(lowercaseQuery) ||
        version.description?.toLowerCase().includes(lowercaseQuery) ||
        version.commits.some(commit =>
          commit.message.toLowerCase().includes(lowercaseQuery) ||
          commit.description?.toLowerCase().includes(lowercaseQuery)
        )
      ))
    );
  }

  getVersionsByType(type: Commit['type']): Observable<Version[]> {
    return of(this.versions).pipe(
      map(versions => versions.filter(version =>
        version.commits.some(commit => commit.type === type)
      ))
    );
  }

  getVersionsByDateRange(startDate: Date, endDate: Date): Observable<Version[]> {
    return of(this.versions).pipe(
      map(versions => versions.filter(version => {
        const versionDate = new Date(version.date);
        return versionDate >= startDate && versionDate <= endDate;
      }))
    );
  }

  // TODO: Implement these methods when backend is available
  // private async getGitCommits(): Promise<Commit[]>
  // private async organizeCommitsIntoVersions(commits: Commit[]): Promise<Version[]>
}
