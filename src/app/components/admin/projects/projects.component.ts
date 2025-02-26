import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProjectsService, Project } from '../../../services/projects.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  projectForm: FormGroup;

  isLoading = false;
  isEditing = false;
  formSubmitted = false;

  private subscription = new Subscription();

  constructor(
    private projectsService: ProjectsService,
    private fb: FormBuilder
  ) {
    this.projectForm = this.createProjectForm();
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadProjects(): void {
    this.isLoading = true;

    const sub = this.projectsService.getAllProjects()
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Errore nel caricamento dei progetti', error);
          this.isLoading = false;
        }
      });

    this.subscription.add(sub);
  }

  createProjectForm(): FormGroup {
    return this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      technologies: ['', Validators.required],
      imageUrl: [''],
      githubUrl: [''],
      liveUrl: [''],
      featured: [false]
    });
  }

  resetForm(): void {
    this.projectForm.reset({
      id: null,
      title: '',
      description: '',
      technologies: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      featured: false
    });

    this.isEditing = false;
    this.selectedProject = null;
    this.formSubmitted = false;
  }

  selectProject(project: Project): void {
    this.selectedProject = project;
    this.isEditing = true;

    // Converte l'array di tecnologie in stringa separata da virgole per il form
    const technologiesString = Array.isArray(project.technologies)
      ? project.technologies.join(', ')
      : project.technologies;

    this.projectForm.setValue({
      id: project.id,
      title: project.title,
      description: project.description,
      technologies: technologiesString,
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: project.featured
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.projectForm.invalid) {
      return;
    }

    const formValues = this.projectForm.value;

    // Converte le tecnologie da stringa a array
    const technologies = formValues.technologies
      .split(',')
      .map((tech: string) => tech.trim())
      .filter((tech: string) => tech.length > 0);

    const projectData = {
      ...formValues,
      technologies
    };

    this.isLoading = true;

    if (this.isEditing) {
      const sub = this.projectsService.updateProject(projectData)
        .subscribe({
          next: () => {
            this.loadProjects();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nell\'aggiornamento del progetto', error);
            this.isLoading = false;
          }
        });

      this.subscription.add(sub);
    } else {
      const { id, ...newProject } = projectData;

      const sub = this.projectsService.addProject(newProject)
        .subscribe({
          next: () => {
            this.loadProjects();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nella creazione del progetto', error);
            this.isLoading = false;
          }
        });

      this.subscription.add(sub);
    }
  }

  deleteProject(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
      this.isLoading = true;

      const sub = this.projectsService.deleteProject(id)
        .subscribe({
          next: () => {
            this.loadProjects();

            if (this.selectedProject?.id === id) {
              this.resetForm();
            }

            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nell\'eliminazione del progetto', error);
            this.isLoading = false;
          }
        });

      this.subscription.add(sub);
    }
  }

  toggleFeatured(id: number): void {
    this.isLoading = true;

    const sub = this.projectsService.toggleFeatured(id)
      .subscribe({
        next: () => {
          this.loadProjects();

          if (this.selectedProject?.id === id) {
            this.selectProject(this.projects.find(p => p.id === id) as Project);
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Errore nel cambio dello stato featured', error);
          this.isLoading = false;
        }
      });

    this.subscription.add(sub);
  }

  // Getters per controlli di validazione del form
  get titleControl() { return this.projectForm.get('title'); }
  get descriptionControl() { return this.projectForm.get('description'); }
  get technologiesControl() { return this.projectForm.get('technologies'); }
}
