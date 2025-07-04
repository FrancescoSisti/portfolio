import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService, ProfileData } from '../../../services/profile.service';

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
  profileData: ProfileData | null = null;

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
      name: ['', [Validators.required, Validators.minLength(2)]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      website: [''],
      github: [''],
      linkedin: [''],
      instagram: [''],
      avatarUrl: ['']
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.clearMessages();

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profileData = profile;
        this.populateForm(profile);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Errore nel caricamento del profilo';
        console.error('Profile load error:', error);
        this.isLoading = false;
      }
    });
  }

  populateForm(profile: ProfileData): void {
    this.profileForm.patchValue({
      name: profile.name || '',
      title: profile.title || '',
      bio: profile.bio || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      website: profile.website || '',
      github: profile.github || '',
      linkedin: profile.linkedin || '',
      instagram: profile.instagram || '',
      avatarUrl: profile.avatarUrl || ''
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSaving = true;
    this.clearMessages();

    const profileData: ProfileData = {
      ...this.profileForm.value
    };

    this.profileService.updateProfile(profileData).subscribe({
      next: (updatedProfile) => {
        this.profileData = updatedProfile;
        this.successMessage = 'Profilo aggiornato con successo!';
        this.isSaving = false;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
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

  // Form getters
  get name() { return this.profileForm.get('name'); }
  get title() { return this.profileForm.get('title'); }
  get bio() { return this.profileForm.get('bio'); }
  get email() { return this.profileForm.get('email'); }
}
