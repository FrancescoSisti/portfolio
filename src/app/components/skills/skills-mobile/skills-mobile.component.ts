import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Skill {
  name: string;
  icon: string;
  category: string;
  level: number;
  color: string;
  description: string;
  experience: string;
}

interface Project {
  name: string;
  description: string;
  image: string;
  technologies: Technology[];
  links: {
    github?: string;
    live?: string;
  };
}

interface Technology {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-skills-mobile',
  templateUrl: './skills-mobile.component.html',
  styleUrls: ['./skills-mobile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SkillsMobileComponent {
  activeTab: 'skills' | 'projects' = 'skills';
  searchQuery: string = '';
  selectedCategory: string = 'Tutti';

  skills: Skill[] = [
    {
      name: 'Angular',
      icon: 'devicon-angularjs-plain',
      category: 'Frontend',
      level: 90,
      color: '#dd0031',
      description: 'Framework per lo sviluppo di applicazioni web moderne',
      experience: '3+ anni di esperienza'
    },
    {
      name: 'React',
      icon: 'devicon-react-original',
      category: 'Frontend',
      level: 85,
      color: '#61dafb',
      description: 'Libreria per la creazione di interfacce utente dinamiche',
      experience: '2+ anni di esperienza'
    },
    {
      name: 'Node.js',
      icon: 'devicon-nodejs-plain',
      category: 'Backend',
      level: 88,
      color: '#68a063',
      description: 'Runtime JavaScript per lo sviluppo backend',
      experience: '3+ anni di esperienza'
    },
    {
      name: 'Python',
      icon: 'devicon-python-plain',
      category: 'Backend',
      level: 82,
      color: '#3776ab',
      description: 'Linguaggio versatile per backend e data science',
      experience: '2+ anni di esperienza'
    },
    {
      name: 'TypeScript',
      icon: 'devicon-typescript-plain',
      category: 'Linguaggi',
      level: 92,
      color: '#007acc',
      description: 'Superset tipizzato di JavaScript',
      experience: '3+ anni di esperienza'
    },
    {
      name: 'Docker',
      icon: 'devicon-docker-plain',
      category: 'DevOps',
      level: 78,
      color: '#2496ed',
      description: 'Containerizzazione e orchestrazione di applicazioni',
      experience: '2+ anni di esperienza'
    }
  ];

  projects: Project[] = [
    {
      name: 'Portfolio Personale',
      description: 'Portfolio interattivo sviluppato con Angular e TypeScript, con animazioni fluide e design responsive.',
      image: 'assets/images/projects/portfolio.jpg',
      technologies: [
        { name: 'Angular', icon: 'devicon-angularjs-plain', color: '#dd0031' },
        { name: 'TypeScript', icon: 'devicon-typescript-plain', color: '#007acc' },
        { name: 'SCSS', icon: 'devicon-sass-original', color: '#cc6699' }
      ],
      links: {
        github: 'https://github.com/tuouser/portfolio',
        live: 'https://tuodominio.com'
      }
    },
    {
      name: 'E-commerce Dashboard',
      description: 'Dashboard amministrativa per la gestione di un e-commerce, con analisi dati in tempo reale.',
      image: 'assets/images/projects/dashboard.jpg',
      technologies: [
        { name: 'React', icon: 'devicon-react-original', color: '#61dafb' },
        { name: 'Node.js', icon: 'devicon-nodejs-plain', color: '#68a063' },
        { name: 'MongoDB', icon: 'devicon-mongodb-plain', color: '#47a248' }
      ],
      links: {
        github: 'https://github.com/tuouser/dashboard'
      }
    }
  ];

  get categories(): string[] {
    return ['Tutti', ...new Set(this.skills.map(skill => skill.category))];
  }

  get filteredSkills(): Skill[] {
    let filtered = this.skills;
    if (this.selectedCategory !== 'Tutti') {
      filtered = filtered.filter(skill => skill.category === this.selectedCategory);
    }
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }

  get filteredProjects(): Project[] {
    if (!this.searchQuery) return this.projects;
    const query = this.searchQuery.toLowerCase();
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.name.toLowerCase().includes(query))
    );
  }

  setActiveTab(tab: 'skills' | 'projects'): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.selectedCategory = 'Tutti';
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }
}
