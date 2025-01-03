import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/admin'; // URL de l'API backend
  private jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );

  constructor(private http: HttpClient, private router: Router) {}

  // Vérifie si un token existe dans localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Observable pour l'état de connexion
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Méthode pour se connecter
  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      username,
      password,
    });
  }

  // Stocke le token et met à jour l'état de connexion
  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.isAuthenticatedSubject.next(true);
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Retourne le token stocké
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Récupère l'utilisateur depuis le token JWT
  getUserRole(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); 
      return decodedToken.statut; // Assurez-vous que le rôle est inclus dans le token
    }
    return '';
  }

  // Vérifie si l'utilisateur est un admin
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  // Vérifie si l'utilisateur est un gestionnaire
  isGestionnaire(): boolean {
    return this.getUserRole() === 'Gestionnaire';
  }

  // Redirige l'utilisateur en fonction de son rôle
  redirectUser(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.isGestionnaire()) {
      this.router.navigate(['/utilisateur']);
    } else {
      this.router.navigate(['/']);
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
