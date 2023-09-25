import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _authService = inject(AuthService);

  if (_authService.isLoggedIn) return true;
  else {
    alert('Please login first.');
    router.navigate(['/login']);
    return false;
  }
};
