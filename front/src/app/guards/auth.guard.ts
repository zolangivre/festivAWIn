import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    // Vérifiez le rôle dans le token
    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const userRole = decodedToken.statut;

    // Si l'utilisateur n'est pas admin ou gestionnaire, redirigez-le
    if (((state.url.includes('/admin') ||
      state.url.includes('/session') ||
      state.url.includes('/bilan')) && userRole !== 'Admin') ||
      (state.url.includes('/utilisateur') && !['Admin', 'Gestionnaire'].includes(userRole))
    ) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}