import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../../services/weather.service';

interface Skill {
  name: string;
  icon: string;
  description: string;
  level: number;
  tags: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  icon: string;
}

@Component({
  selector: 'app-skills-mobile',
  templateUrl: './skills-mobile.component.html',
  styleUrls: ['./skills-mobile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SkillsMobileComponent implements OnInit {
  activeTab: 'skills' | 'projects' | 'weather' = 'skills';
  searchQuery: string = '';

  skills: Skill[] = [
    {
      name: 'Frontend Development',
      icon: 'fas fa-code',
      description: 'Sviluppo di interfacce web moderne e responsive',
      level: 90,
      tags: ['Angular', 'React', 'Vue.js', 'TypeScript', 'SCSS']
    },
    {
      name: 'Backend Development',
      icon: 'fas fa-server',
      description: 'Sviluppo di API RESTful e architetture scalabili',
      level: 85,
      tags: ['Node.js', 'PHP', 'Python', 'MongoDB', 'MySQL']
    },
    {
      name: 'Mobile Development',
      icon: 'fas fa-mobile-alt',
      description: 'Sviluppo di applicazioni mobile native e cross-platform',
      level: 80,
      tags: ['React Native', 'Flutter', 'iOS', 'Android']
    },
    {
      name: 'DevOps',
      icon: 'fas fa-cloud',
      description: 'Gestione dell\'infrastruttura e deployment automatizzato',
      level: 75,
      tags: ['Docker', 'AWS', 'CI/CD', 'Kubernetes']
    }
  ];

  projects: Project[] = [
    {
      name: 'Portfolio Interattivo',
      description: 'Portfolio personale con widgets interattivi e design moderno',
      technologies: ['Angular', 'TypeScript', 'SCSS'],
      icon: 'fas fa-briefcase'
    },
    {
      name: 'E-commerce Platform',
      description: 'Piattaforma e-commerce completa con gestione ordini e pagamenti',
      technologies: ['React', 'Node.js', 'MongoDB'],
      icon: 'fas fa-shopping-cart'
    },
    {
      name: 'CMS Headless',
      description: 'Sistema di gestione contenuti headless con API GraphQL',
      technologies: ['Node.js', 'GraphQL', 'PostgreSQL'],
      icon: 'fas fa-newspaper'
    },
    {
      name: 'Weather App',
      description: 'Applicazione meteo con previsioni in tempo reale',
      technologies: ['Angular', 'OpenWeather API'],
      icon: 'fas fa-cloud-sun'
    }
  ];

  weatherData: any = null;
  isLoadingWeather: boolean = false;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.loadDefaultWeather();
  }

  private async loadDefaultWeather(): Promise<void> {
    try {
      this.isLoadingWeather = true;
      // Implementazione del caricamento meteo
      this.isLoadingWeather = false;
    } catch (error) {
      console.error('Error loading weather:', error);
      this.isLoadingWeather = false;
    }
  }

  get filteredSkills(): Skill[] {
    return this.skills.filter(skill =>
      skill.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      skill.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  get filteredProjects(): Project[] {
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
  }

  setActiveTab(tab: 'skills' | 'projects' | 'weather'): void {
    this.activeTab = tab;
  }
}
