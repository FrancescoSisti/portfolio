import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatisticsService, DashboardStats } from '../../../services/statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.statisticsService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Errore nel caricamento delle statistiche';
        console.error('Statistics load error:', error);
        this.isLoading = false;
      }
    });
  }

  refreshStats(): void {
    this.loadStatistics();
  }

  // Helper methods for display
  getTotalProjects(): number {
    return this.stats?.projectStats.totalProjects || 0;
  }

  getCompletedProjects(): number {
    return this.stats?.projectStats.completedProjects || 0;
  }

  getTotalVisits(): number {
    return this.stats?.visitStats.totalVisits || 0;
  }

  getUniqueVisitors(): number {
    return this.stats?.visitStats.uniqueVisitors || 0;
  }

  getTotalContacts(): number {
    return this.stats?.contactStats.totalContacts || 0;
  }

  getLastUpdateFormatted(): string {
    if (!this.stats?.lastUpdated) return 'N/A';
    return new Date(this.stats.lastUpdated).toLocaleString('it-IT');
  }

  // Get completion percentage
  getProjectCompletionPercentage(): number {
    if (!this.stats?.projectStats.totalProjects) return 0;
    return Math.round((this.stats.projectStats.completedProjects / this.stats.projectStats.totalProjects) * 100);
  }

  // Get skills by category count
  getSkillsByCategory(category: string): number {
    if (!this.stats?.skillStats) return 0;
    return this.stats.skillStats.filter(skill => skill.category === category).length;
  }

  // Get most visited page
  getMostVisitedPage(): string {
    if (!this.stats?.visitStats.visitsPerPage || this.stats.visitStats.visitsPerPage.length === 0) {
      return 'N/A';
    }
    return this.stats.visitStats.visitsPerPage[0].page;
  }

  // Get most used technology
  getMostUsedTechnology(): string {
    if (!this.stats?.projectStats.projectsByTechnology || this.stats.projectStats.projectsByTechnology.length === 0) {
      return 'N/A';
    }
    return this.stats.projectStats.projectsByTechnology[0].name;
  }
}
