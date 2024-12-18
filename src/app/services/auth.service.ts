import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/admin'; // URL de l'API backend
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
}
