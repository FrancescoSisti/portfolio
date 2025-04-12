import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;
  returnUrl: string = '/admin';
  loginAttempts = 0;

  @ViewChild('passwordInput') passwordInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inizializza il form
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Controlla se c'è un URL di ritorno nei parametri di query
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';

    // Se l'utente è già loggato, va alla pagina admin
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }

    // Recupera username salvato se esiste
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      this.loginForm.patchValue({
        username: savedUsername,
        rememberMe: true
      });
    }
  }

  // Getter per accedere facilmente ai campi del form
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  get rememberMe() { return this.loginForm.get('rememberMe'); }

  focusPassword(): void {
    if (this.passwordInput) {
      this.passwordInput.nativeElement.focus();
    }
  }

  onSubmit(): void {
    // Blocca multipli tentativi durante il caricamento
    if (this.isLoading) return;

    // Non procedere se il form non è valido
    if (this.loginForm.invalid) {
      this.evidenziaErrori();
      return;
    }

    this.loginAttempts++;
    this.isLoading = true;
    this.errorMessage = '';

    const { username, password, rememberMe } = this.loginForm.value;

    // Salva username in localStorage se rememberMe è selezionato
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    this.authService.login(username, password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage = 'Credenziali non valide. Riprova.';
          this.isLoading = false;

          // Reset password ma mantieni username
          this.loginForm.patchValue({ password: '' });
        }
      },
      error: (error) => {
        this.errorMessage = 'Si è verificato un errore. Riprova più tardi.';
        console.error('Login error:', error);
        this.isLoading = false;
      }
    });
  }

  evidenziaErrori(): void {
    // Trova tutti i campi del form con errori e marca come touched per mostrare gli errori
    Object.keys(this.loginForm.controls).forEach(field => {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
