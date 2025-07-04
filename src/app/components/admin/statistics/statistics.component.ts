import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatisticsService, PortfolioStats } from '../../../services/statistics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  stats: PortfolioStats | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.statisticsService.getPortfolioStatistics().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: (error) => {
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
  getProjectsGrowth(): string {
    if (!this.stats) return '0%';
    const growth = this.stats.projectsGrowth;
    return growth > 0 ? `+${growth}%` : `${growth}%`;
  }

  getSkillsGrowth(): string {
    if (!this.stats) return '0%';
    const growth = this.stats.skillsGrowth;
    return growth > 0 ? `+${growth}%` : `${growth}%`;
  }

  getVisitsGrowth(): string {
    if (!this.stats) return '0%';
    const growth = this.stats.visitsGrowth;
    return growth > 0 ? `+${growth}%` : `${growth}%`;
  }

  getLastUpdateFormatted(): string {
    if (!this.stats?.lastUpdate) return 'N/A';
    return new Date(this.stats.lastUpdate).toLocaleString('it-IT');
  }
}
