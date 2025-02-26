import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
  dailyVisits: DailyVisit[];
  monthlyVisits: MonthlyVisit[];
  visitsPerPage: PageVisit[];
}

export interface DailyVisit {
  date: string;
  count: number;
}

export interface MonthlyVisit {
  month: string;
  count: number;
}

export interface PageVisit {
  page: string;
  count: number;
  percentage: number;
}

export interface SkillStat {
  name: string;
  level: number;
  category: string;
}

export interface ProjectStat {
  totalProjects: number;
  completedProjects: number;
  featuredProjects: number;
  projectsByTechnology: TechnologyStat[];
}

export interface TechnologyStat {
  name: string;
  count: number;
}

export interface ContactStat {
  totalContacts: number;
  contactsByType: {
    type: string;
    count: number;
  }[];
}

export interface DashboardStats {
  visitStats: VisitStats;
  projectStats: ProjectStat;
  skillStats: SkillStat[];
  contactStats: ContactStat;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { }

  // Ottieni statistiche complete per la dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return of({
      visitStats: this.getMockVisitStats(),
      projectStats: this.getMockProjectStats(),
      skillStats: this.getMockSkillStats(),
      contactStats: this.getMockContactStats(),
      lastUpdated: new Date()
    }).pipe(delay(800)); // Simulare latenza di rete
  }

  // Ottieni solo statistiche visite
  getVisitStats(): Observable<VisitStats> {
    return of(this.getMockVisitStats()).pipe(delay(600));
  }

  // Ottieni solo statistiche progetti
  getProjectStats(): Observable<ProjectStat> {
    return of(this.getMockProjectStats()).pipe(delay(400));
  }

  // Ottieni solo statistiche skills
  getSkillStats(): Observable<SkillStat[]> {
    return of(this.getMockSkillStats()).pipe(delay(300));
  }

  // Ottieni solo statistiche contatti
  getContactStats(): Observable<ContactStat> {
    return of(this.getMockContactStats()).pipe(delay(300));
  }

  // Dati mockati per le statistiche

  private getMockVisitStats(): VisitStats {
    const today = new Date();
    const dailyVisits: DailyVisit[] = [];
    const monthlyVisits: MonthlyVisit[] = [];

    // Generare dati per gli ultimi 30 giorni
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

      // Simulare un pattern con più visite nei fine settimana
      let count = Math.floor(Math.random() * 20) + 10;
      if (date.getDay() === 0 || date.getDay() === 6) {
        count += Math.floor(Math.random() * 15);
      }

      dailyVisits.push({
        date: formattedDate,
        count
      });
    }

    // Generare dati per gli ultimi 12 mesi
    const monthNames = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    for (let i = 11; i >= 0; i--) {
      const month = new Date();
      month.setMonth(today.getMonth() - i);

      const monthIndex = month.getMonth();
      const yearStr = month.getFullYear().toString();
      const formattedMonth = `${monthNames[monthIndex]} ${yearStr}`;

      // Simulare un pattern con più visite in primavera e autunno
      let count = Math.floor(Math.random() * 300) + 200;
      if (monthIndex >= 2 && monthIndex <= 4) {
        count += Math.floor(Math.random() * 200);
      } else if (monthIndex >= 8 && monthIndex <= 10) {
        count += Math.floor(Math.random() * 150);
      }

      monthlyVisits.push({
        month: formattedMonth,
        count
      });
    }

    // Visite per pagina
    const visitsPerPage: PageVisit[] = [
      { page: 'Home', count: 1250, percentage: 45.5 },
      { page: 'Progetti', count: 856, percentage: 31.1 },
      { page: 'Chi Sono', count: 412, percentage: 15.0 },
      { page: 'Skills', count: 187, percentage: 6.8 },
      { page: 'Contatti', count: 45, percentage: 1.6 }
    ];

    return {
      totalVisits: 2750,
      uniqueVisitors: 1820,
      dailyVisits,
      monthlyVisits,
      visitsPerPage
    };
  }

  private getMockProjectStats(): ProjectStat {
    return {
      totalProjects: 12,
      completedProjects: 10,
      featuredProjects: 5,
      projectsByTechnology: [
        { name: 'Angular', count: 6 },
        { name: 'React', count: 4 },
        { name: 'TypeScript', count: 8 },
        { name: 'Node.js', count: 5 },
        { name: 'SCSS', count: 9 },
        { name: 'MongoDB', count: 3 },
        { name: 'Express', count: 4 },
        { name: 'HTML/CSS', count: 12 }
      ]
    };
  }

  private getMockSkillStats(): SkillStat[] {
    return [
      { name: 'Angular', level: 5, category: 'frontend' },
      { name: 'React', level: 4, category: 'frontend' },
      { name: 'Node.js', level: 4, category: 'backend' },
      { name: 'TypeScript', level: 5, category: 'frontend' },
      { name: 'SASS/SCSS', level: 4, category: 'frontend' },
      { name: 'Figma', level: 3, category: 'design' },
      { name: 'Git', level: 4, category: 'tools' },
      { name: 'MongoDB', level: 3, category: 'backend' },
      { name: 'Express', level: 3, category: 'backend' },
      { name: 'JavaScript', level: 5, category: 'frontend' }
    ];
  }

  private getMockContactStats(): ContactStat {
    return {
      totalContacts: 28,
      contactsByType: [
        { type: 'Email', count: 15 },
        { type: 'Form di contatto', count: 8 },
        { type: 'LinkedIn', count: 3 },
        { type: 'GitHub', count: 2 }
      ]
    };
  }
}
