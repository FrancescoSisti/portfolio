import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillsService, Skill, SkillCategory } from '../../../services/skills.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit, OnDestroy {
  skills: Skill[] = [];
  categories: {label: string, value: SkillCategory}[] = [];
  selectedSkill: Skill | null = null;
  skillForm: FormGroup;

  isLoading = false;
  isEditing = false;
  formSubmitted = false;

  private subscription = new Subscription();

  constructor(
    private skillsService: SkillsService,
    private fb: FormBuilder
  ) {
    this.skillForm = this.createSkillForm();
  }

  ngOnInit(): void {
    this.loadSkills();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadSkills(): void {
    this.isLoading = true;

    const sub = this.skillsService.getAllSkills()
      .subscribe({
        next: (skills) => {
          this.skills = skills;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Errore nel caricamento delle skills', error);
          this.isLoading = false;
        }
      });

    this.subscription.add(sub);
  }

  loadCategories(): void {
    const sub = this.skillsService.getSkillCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Errore nel caricamento delle categorie', error);
        }
      });

    this.subscription.add(sub);
  }

  createSkillForm(): FormGroup {
    return this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      icon: ['', Validators.required],
      category: ['frontend', Validators.required],
      level: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      description: [''],
      featured: [false],
      yearsExperience: [1, [Validators.required, Validators.min(0)]]
    });
  }

  resetForm(): void {
    this.skillForm.reset({
      id: null,
      name: '',
      icon: '',
      category: 'frontend',
      level: 3,
      description: '',
      featured: false,
      yearsExperience: 1
    });

    this.isEditing = false;
    this.selectedSkill = null;
    this.formSubmitted = false;
  }

  selectSkill(skill: Skill): void {
    this.selectedSkill = skill;
    this.isEditing = true;

    this.skillForm.setValue({
      id: skill.id,
      name: skill.name,
      icon: skill.icon,
      category: skill.category,
      level: skill.level,
      description: skill.description || '',
      featured: skill.featured,
      yearsExperience: skill.yearsExperience
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.skillForm.invalid) {
      return;
    }

    const formValues = this.skillForm.value;
    this.isLoading = true;

    if (this.isEditing) {
      const sub = this.skillsService.updateSkill(formValues)
        .subscribe({
          next: () => {
            this.loadSkills();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nell\'aggiornamento della skill', error);
            this.isLoading = false;
          }
        });

      this.subscription.add(sub);
    } else {
      const { id, ...newSkill } = formValues;

      const sub = this.skillsService.addSkill(newSkill)
        .subscribe({
          next: () => {
            this.loadSkills();
            this.resetForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nella creazione della skill', error);
            this.isLoading = false;
          }
        });

      this.subscription.add(sub);
    }
  }

  deleteSkill(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa competenza?')) {
      this.isLoading = true;

      const sub = this.skillsService.deleteSkill(id)
        .subscribe({
          next: () => {
            this.loadSkills();

            if (this.selectedSkill?.id === id) {
              this.resetForm();
            }

            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nell\'eliminazione della skill', error);
            this.isLoading = false;
          }
        });

      this.subscription.add(sub);
    }
  }

  toggleFeatured(id: number): void {
    this.isLoading = true;

    const sub = this.skillsService.toggleFeatured(id)
      .subscribe({
        next: () => {
          this.loadSkills();

          if (this.selectedSkill?.id === id) {
            this.selectSkill(this.skills.find(s => s.id === id) as Skill);
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
  get nameControl() { return this.skillForm.get('name'); }
  get iconControl() { return this.skillForm.get('icon'); }
  get categoryControl() { return this.skillForm.get('category'); }
  get levelControl() { return this.skillForm.get('level'); }
  get yearsExperienceControl() { return this.skillForm.get('yearsExperience'); }
}
