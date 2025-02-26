import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Reindirizza alla pagina di login se l'utente non è autenticato
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
