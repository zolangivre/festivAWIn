import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VenteJeu } from '../models/vente-jeu';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class VenteJeuService {
  private apiUrl = environment.apiUrl + '/venteJeu';

  constructor(private http: HttpClient) {}

  getJeuxByVenteId(idVente: string): Observable<VenteJeu[]> {
    return this.http.get<VenteJeu[]>(`${this.apiUrl}/${idVente}`);
  }
}
