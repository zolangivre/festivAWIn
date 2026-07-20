import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  private apiUrl = environment.apiUrl + '/facture';

  constructor(private http: HttpClient) {}

  telechargerFacture(venteId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/telecharger/${venteId}`, {
      responseType: 'blob',
    });
  }
}
