import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Utilisateur } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { UserDepotComponent } from '../user-depot/user-depot.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserVenteComponent } from "../user-vente/user-vente.component";

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    UserDepotComponent,
    UserEditComponent,
    UserVenteComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnChanges {
  @Input() utilisateur!: Utilisateur;
  @Output() userDeleted = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<Utilisateur>();
  displayedColumns: string[] = [
    'nom',
    'prenom',
    'mail',
    'telephone',
    'adresse',
    'role',
  ];
  editMode: boolean = false;
  depotMode: boolean = false;
  venteMode: boolean = false;

  constructor(private usersService: UsersService) { }

  ngOnChanges(): void {
    this.editMode = false;
    this.depotMode = false;
    this.venteMode = false;
  }

  onUserUpdated(): void {
    this.editMode = false;
    this.refreshUserDetails();
    this.userUpdated.emit(this.utilisateur);
  }

  refreshUserDetails(): void {
    const userId = this.utilisateur._id;
    if (userId) {
      this.usersService.getUser(userId).subscribe({
        next: (user) => {
          this.utilisateur = user;
          console.log("Détails de l'utilisateur rafraîchis avec succès");
        },
        error: (error) => {
          console.error(
            "Erreur lors du rafraîchissement des détails de l'utilisateur",
            error
          );
        },
      });
    } else {
      console.error('ID utilisateur non valide');
    }
  }

  deleteUser(utilisateur: Utilisateur): void {
    if (utilisateur._id != null) {
      this.usersService.deleteUser(utilisateur._id).subscribe(() => {
        this.userDeleted.emit();
      });
    } else {
      console.error("Impossible de supprimer l'utilisateur");
    }
  }

}
