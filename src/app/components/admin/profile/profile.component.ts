import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService, Profile } from '../../../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  profileData: Profile | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.profileForm = this.createProfileForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  createProfileForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      summary: ['', [Validators.required, Validators.minLength(10)]],
      location: [''],
      avatarUrl: [''],
      availableForWork: [true]
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.clearMessages();

    this.profileService.getProfile().subscribe({
      next: (profile: Profile | null) => {
        this.profileData = profile;
        if (profile) {
          this.populateForm(profile);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Errore nel caricamento del profilo';
        console.error('Profile load error:', error);
        this.isLoading = false;
      }
    });
  }

  populateForm(profile: Profile): void {
    this.profileForm.patchValue({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      title: profile.title || '',
      bio: profile.bio || '',
      summary: profile.summary || '',
      location: profile.location || '',
      avatarUrl: profile.avatarUrl || '',
      availableForWork: profile.availableForWork || false
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    this.clearMessages();

    const profileData: Partial<Profile> = {
      ...this.profileForm.value
    };

    this.profileService.updateProfile(profileData).subscribe({
      next: (updatedProfile: Profile) => {
        this.profileData = updatedProfile;
        this.successMessage = 'Profilo aggiornato con successo!';
        this.isSaving = false;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Errore nel salvataggio del profilo';
        console.error('Profile save error:', error);
        this.isSaving = false;
      }
    });
  }

  resetForm(): void {
    if (this.profileData) {
      this.populateForm(this.profileData);
    } else {
      this.profileForm.reset();
    }
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  // Image error handler
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  // Form getters
  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get title() { return this.profileForm.get('title'); }
  get bio() { return this.profileForm.get('bio'); }
  get summary() { return this.profileForm.get('summary'); }
}
