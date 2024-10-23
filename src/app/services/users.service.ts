import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Utilisateur } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private utilisateurs: Utilisateur[] = [
    new Utilisateur("Dupont", "Jean", "jean.dupont@example.com", "0612345678", "12 Rue de Paris", "Admin", 1),
    new Utilisateur("Martin", "Alice", "alice.martin@example.com", "0623456789", "45 Rue de Lyon", "Vendeur", 2),
    new Utilisateur("Durand", "Paul", "paul.durand@example.com", "", "78 Rue de Marseille", "Gestionnaire", 3),
    new Utilisateur("Moreau", "Claire", "claire.moreau@example.com", "", "", "Acheteur", 4),
    new Utilisateur("Lefevre", "Antoine", "antoine.lefevre@example.com", "0634567890", "34 Rue de Bordeaux", "Vendeur", 5),
    new Utilisateur("Bernard", "Sophie", "sophie.bernard@example.com", "0645678901", "", "Gestionnaire", 6),
    new Utilisateur("Petit", "Julien", "julien.petit@example.com", "", "90 Rue de Lille", "Acheteur", 7),
    new Utilisateur("Roux", "Isabelle", "isabelle.roux@example.com", "", "", "Acheteur", 8),
    new Utilisateur("Fournier", "Marc", "marc.fournier@example.com", "0656789012", "56 Rue de Nice", "Vendeur", 9),
    new Utilisateur("Girard", "Elise", "elise.girard@example.com", "0667890123", "23 Rue de Toulouse", "Vendeur", 10)
  ];

  constructor() {}

  getUsers(): Observable<Utilisateur[]> {
    return of(this.utilisateurs);
  }

  getUser(id: number): Observable<Utilisateur> {
    const utilisateur = this.utilisateurs.find(u => u.idUtilisateur === id);
    return of(utilisateur!);
  }
}
