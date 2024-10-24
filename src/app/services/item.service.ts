import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { JeuDepot } from '../models/item';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = 'http://localhost:3000/jeuDepot';

  constructor(private http: HttpClient) { }

  getItems(): Observable<(JeuDepot & { cols: number; rows: number })[]> {
    return this.http.get<JeuDepot[]>(this.apiUrl).pipe(
      map(items =>
        items.map(item => ({
          ...item,
          cols: Math.floor(Math.random() * 2) + 1,  // Valeur aléatoire entre 1 et 2 pour les colonnes
          rows: Math.floor(Math.random() * 2) + 1   // Valeur aléatoire entre 1 et 2 pour les lignes
        }))
      )
    );
  }

  getItemById(id: number): Observable<JeuDepot | undefined> {
    return this.http.get<JeuDepot[]>(`${this.apiUrl}?idJeuDepot=${id}`).pipe(
      map(items => items.length > 0 ? items[0] : undefined)
    );
  }
}
