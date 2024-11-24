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

  getItems(): Observable<(JeuDepot & { rows: number })[]> {
    return this.http.get<JeuDepot[]>(this.apiUrl).pipe(
      map((items) =>
        items.map((item) => ({
          ...item,
          rows: Math.floor(Math.random() * 3) + 3, // Valeur aléatoire entre 3 et 5 pour les lignes
        }))
      )
    );
  }

  getFilteredItems(
    searchTerm: string,
    minPrice: number | null,
    maxPrice: number | null,
    availabilityFilter: string
  ): Observable<(JeuDepot & { rows: number })[]> {
    return this.getItems().pipe(
      map((items) =>
        items.filter((item) => {
          // Filtrer les noms des jeuDepot
          const matchesSearch =
            !searchTerm ||
            item.nomJeu.toLowerCase().startsWith(searchTerm.toLowerCase());

          // Filtrer les jeuDepot en fontction de leur prix
          const matchesMinPrice = minPrice === null || item.prixJeu >= minPrice;
          const matchesMaxPrice = maxPrice === null || item.prixJeu <= maxPrice;

          // Filtrr les jeuDepot en fonction de leur disponibilité
          const matchesAvailability =
            availabilityFilter === 'all' ||
            (availabilityFilter === 'available' &&
              item.statutJeu === 'Disponible') ||
            (availabilityFilter === 'soldout' && item.statutJeu === 'SoldOut');

          return (
            matchesSearch &&
            matchesMinPrice &&
            matchesMaxPrice &&
            matchesAvailability
          );
        })
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
}
