import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VenteJeu } from '../models/vente-jeu';

@Injectable({
  providedIn: 'root'
})
export class VenteService {

  private apiUrl = 'http://localhost:3002/api/vente';

  constructor(private http: HttpClient) { }

  createVente(acheteurId: string, vendeurId: string, montantTotal: number, commissionVente: number, jeuxVendus: VenteJeu[]): Observable<any> {
    const venteData = { acheteurId, vendeurId, montantTotal, commissionVente, jeuxVendus };
    console.log("Données envoyes au back avec la requete :", venteData);
    return this.http.post<any>(this.apiUrl, venteData);
  }

}

