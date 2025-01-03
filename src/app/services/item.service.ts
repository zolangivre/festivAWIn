import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { JeuDepot } from '../models/item';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = environment.apiUrl + '/jeuDepot';

  constructor(private http: HttpClient) {}

  getItemsPasSupprime(): Observable<(JeuDepot & { rows: number })[]> {
    return this.http.get<JeuDepot[]>(this.apiUrl).pipe(
      map((items) =>
        items.map((item) => ({
          ...item,
          rows: Math.floor(Math.random() * 3) + 3,
        }))
      )
    );
  }

  addItem(item: JeuDepot): Observable<JeuDepot> {
    return this.http.post<JeuDepot>(this.apiUrl, item);
  }

  getItemsByUser(idUtilisateur: string): Observable<JeuDepot[]> {
    return this.http.get<JeuDepot[]>(`${this.apiUrl}/user/${idUtilisateur}`);
  }

  deleteJeuDepot(idJeuDepot: string): Observable<JeuDepot> {
    return this.http.delete<JeuDepot>(`${this.apiUrl}/${idJeuDepot}`);
  }

  deleteAllJeuDepotUser(idUtilisateur: string): Observable<JeuDepot> {
    return this.http.delete<JeuDepot>(`${this.apiUrl}/user/${idUtilisateur}`);
  }

  updateJeuDepot(item: JeuDepot): Observable<JeuDepot> {
    return this.http.put<JeuDepot>(`${this.apiUrl}/${item._id}`, item);
  }

  getJeuDepot(idJeuDepot: string): Observable<JeuDepot> {
    return this.http.get<JeuDepot>(`${this.apiUrl}/${idJeuDepot}`);
  }

  getItemById(id: string): Observable<JeuDepot> {
    return this.http.get<JeuDepot>(`${this.apiUrl}/${id}`);
  }

  getAllItems(): Observable<JeuDepot[]> {
    return this.http.get<JeuDepot[]>(`${this.apiUrl}/all`);
  }
}
