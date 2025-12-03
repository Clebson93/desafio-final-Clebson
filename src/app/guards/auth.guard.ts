import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // **CORREÇÃO AQUI:** Usar o nome correto 'isLogged' e chamá-lo como função '()' para ler o valor da signal.
  if (authService.isLogged()) { 
    return true;
  }

  // Se não estiver logado, redireciona e retorna false.
  router.navigate(['/login']); 
  return false;
};