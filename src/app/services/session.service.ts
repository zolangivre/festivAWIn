import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private apiUrl = environment.apiUrl + '/session';

  constructor(private http: HttpClient) {}

  getNextPlannedSession(): Observable<Session> {
    return this.http.get<Session>(this.apiUrl + '/nextsession');
  }

  isSessionActive(): Observable<boolean> {
    return this.http
      .get<{ isActive: boolean }>(this.apiUrl + '/activesession')
      .pipe(map((response) => response.isActive));
  }

  getSessionPlanifie(): Observable<Session> {
    return this.http.get<Session>(this.apiUrl + '/planifiee');
  }

  getSessionEnCours(): Observable<Session> {
    return this.http.get<Session>(this.apiUrl + '/encours');
  }

  addSession(session: Session): Observable<Session> {
    return this.http.post<Session>(this.apiUrl, session);
  }

  updateSessionStatus(): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/update', {});
  }

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl);
  }

  deleteSession(idSession: string): Observable<Session> {
    return this.http.delete<Session>(`${this.apiUrl}/${idSession}`);
  }
}
