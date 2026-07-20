import { Injectable } from '@angular/core';
import { Bilan } from '../models/bilan';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BilanService {
  private apiUrl = environment.apiUrl + '/bilan';

  constructor(private http: HttpClient) {}

  getBilans() {
    return this.http.get<Bilan[]>(this.apiUrl);
  }

  getBilanById(id: string) {
    return this.http.get<Bilan>(`${this.apiUrl}/${id}`);
  }

  createBilan(vendeurId: string): Observable<Bilan> {
    const bilan = {
      vendeurId,
      sommeDues: 0,
      gains: 0,
      totalFrais: 0,
      totalCommissions: 0
    };
    return this.http.post<Bilan>(this.apiUrl, bilan);
  }

  updateBilan(bilanId: string, bilan: Bilan) {
    return this.http.put<Bilan>(`${this.apiUrl}/${bilanId}`, bilan);
  }

  deleteBilan(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
