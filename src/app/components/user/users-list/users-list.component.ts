import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Utilisateur } from '../../../models/user';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { MatTableModule } from '@angular/material/table';
import { UsersService } from '../../../services/users.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserEditComponent } from '../user-edit/user-edit.component';
@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserDetailsComponent, MatTableModule, MatButton, UserEditComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})

export class UsersListComponent {
  utilisateurs: Utilisateur[] = [];
  utilisateur!: Utilisateur;
  selectedUser: Utilisateur | null = null;

  constructor(private usersService: UsersService, private router : Router ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(utilisateurs => this.utilisateurs = utilisateurs);
  }

  deleteUser(utilisateur: Utilisateur): void {
    console.log(utilisateur.idUtilisateur);
    if (utilisateur.idUtilisateur != null) {
      this.usersService.deleteUser(utilisateur.idUtilisateur).subscribe(() => {
        this.getUsers();
      });
    } else {
      console.error("Impossible de supprimer l'utilisateur");
    }
  }

  navigateToEdit(utilisateur: Utilisateur): void {
    this.selectedUser = utilisateur;
    this.router.navigate(['/edit/utilisateur/', utilisateur.idUtilisateur], {
      state: { utilisateur: this.selectedUser }
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/add/utilisateur/']);
  }
}
