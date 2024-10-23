import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JeuDepot } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private items: JeuDepot[] = [
    new JeuDepot(1, 'Catan', 'Kosmos', 35, '1', 'disponible', '2024-10-20', 2, 0),
    new JeuDepot(2, 'Carcassonne', 'Hans im Glück', 25, '1', 'disponible', '2024-10-19', 1.5, 5),
    new JeuDepot(3, 'Pandemic', 'Z-Man Games', 30, '1', 'disponible', '2024-10-18', 3, 10)
  ];

  constructor() { }

  getItems(): Observable<(JeuDepot & { cols: number; rows: number })[]> {
    return of(this.items.map(item => ({
      ...item,
      cols: Math.floor(Math.random() * 3) + 1,  // Random value between 1 and 3
      rows: Math.floor(Math.random() * 3) + 1   // Random value between 1 and 3
    })));
  }

  getItemById(id: number): Observable<JeuDepot | undefined> {
    return of(this.items.find(item => item.idJeuDepot === id));
  }
}
