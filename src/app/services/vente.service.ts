import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VenteJeu } from '../models/vente-jeu';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  private apiUrl = environment.apiUrl+ '/vente';

  constructor(private http: HttpClient) { }

  createVente(acheteurId: string, vendeurId: string, montantTotal: number, commissionVente: number, jeuxVendus: VenteJeu[]): Observable<any> {
    const venteData = { acheteurId, vendeurId, montantTotal, commissionVente, jeuxVendus };
    console.log("Données envoyes au back avec la requete :", venteData);
    return this.http.post<any>(this.apiUrl, venteData);
  }

  getVentes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getVentesByAcheteurId(acheteurId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/acheteur/' + acheteurId);
  }

  getVentesByVendeurId(vendeurId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/vendeur/' + vendeurId);
  }
}

