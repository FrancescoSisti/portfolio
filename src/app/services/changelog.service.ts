import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Commit {
  hash: string;
  date: string;
  message: string;
}

export interface Version {
  version: string;
  date: string;
  commits: Commit[];
}

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {
  // Temporary solution until we implement a backend
  private versions: Version[] = [
    {
      version: 'development',
      date: '2024-02-11',
      commits: [
        {
          hash: '3eaf6b6',
          date: '2024-02-11',
          message: 'Add changelog feature with version tracking'
        },
        {
          hash: '276524e',
          date: '2024-02-11',
          message: 'Implement mobile-first design for changelog'
        }
      ]
    },
    {
      version: '1.0.0',
      date: '2024-02-10',
      commits: [
        {
          hash: '5a52041',
          date: '2024-02-10',
          message: 'Add Mobile Projects View with Responsive Design'
        },
        {
          hash: '364ce0b',
          date: '2024-02-10',
          message: 'Enhance Mobile Navbar with iOS-inspired patterns'
        }
      ]
    },
    {
      version: '0.2.0',
      date: '2024-02-03',
      commits: [
        {
          hash: 'f9049fb',
          date: '2024-02-03',
          message: 'Add Creative Project Previews'
        },
        {
          hash: '1e30f18',
          date: '2024-02-03',
          message: 'Implement Interactive Skills View'
        }
      ]
    },
    {
      version: '0.1.0',
      date: '2024-01-15',
      commits: [
        {
          hash: '46b0bfe',
          date: '2024-01-15',
          message: 'Initial portfolio setup'
        },
        {
          hash: '3282a71',
          date: '2024-01-15',
          message: 'Add basic site structure and navigation'
        }
      ]
    }
  ];

  constructor() { }

  getVersions(): Observable<Version[]> {
    return of(this.versions);
  }

  getLatestVersion(): Observable<Version> {
    return of(this.versions[0]);
  }

  getVersionByNumber(version: string): Observable<Version | undefined> {
    return of(this.versions.find(v => v.version === version));
  }

  // TODO: Implement these methods when backend is available
  // private async getGitCommits(): Promise<Commit[]>
  // private async organizeCommitsIntoVersions(commits: Commit[]): Promise<Version[]>
}
