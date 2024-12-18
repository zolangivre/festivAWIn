import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Utilisateur } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = environment.apiUrl + '/utilisateur';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  getUser(idUtilisateur: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${idUtilisateur}`);
  }

  addUser(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur);
  }

  deleteUser(idUtilisateur: string): Observable<Utilisateur> {
    return this.http.delete<Utilisateur>(`${this.apiUrl}/${idUtilisateur}`);
  }

  updateUser(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${utilisateur._id}`, utilisateur);
  }

  getUsersByRole(role: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/${role}`);
  }
}
