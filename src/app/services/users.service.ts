import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Utilisateur } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = 'http://localhost:3000/utilisateur';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  getUser(idUtilisateur: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${idUtilisateur}`);
  }

  addUser(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, utilisateur);
  }

  deleteUser(idUtilisateur: number): Observable<Utilisateur> {
    return this.http.delete<Utilisateur>(`${this.apiUrl}/${idUtilisateur}`);
  }

  updateUser(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${utilisateur.idUtilisateur}`, utilisateur);
  }
}
