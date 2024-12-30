import { Component } from '@angular/core';

import { Utilisateur } from '../../../models/user';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { BilanComponent } from '../../bilan/bilan.component';
import { UsersService } from '../../../services/users.service';

import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Router } from '@angular/router';

@Component({
    selector: 'app-users-list',
    imports: [
        UserDetailsComponent,
        MatTableModule,
        MatButton,
        MatListModule,
        MatInputModule,
        MatFormFieldModule,
        BilanComponent,
    ],
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  utilisateurs: Utilisateur[] = [];
  utilisateur!: Utilisateur;
  selectedRole: string = 'all';
  selectedUser: Utilisateur | null = null;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    if (this.selectedRole === 'all') {
      this.usersService.getUsers().subscribe((utilisateurs) => {
        this.utilisateurs = utilisateurs;
      });
    } else {
      this.usersService
        .getUsersByRole(this.selectedRole)
        .subscribe((utilisateurs) => {
          this.utilisateurs = utilisateurs;
        });
    }
  }

  navigateToAdd(): void {
    this.router.navigate(['/add/utilisateur/']);
  }

  filterUsers(role: string): void {
    this.selectedRole = role;
    this.getUsers();
  }

  showDetails(utilisateur: Utilisateur): void {
    this.selectedUser = utilisateur;
  }

  onUserDeleted(): void {
    this.getUsers();
    this.selectedUser = null;
  }

  onUserUpdated(): void {
    this.getUsers();
    this.selectedUser = this.selectedUser;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.trim() === '') {
      this.getUsers();
    } else {
      this.utilisateurs = this.utilisateurs.filter(
        (utilisateur) =>
          utilisateur.nom
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase()) ||
          utilisateur.prenom
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase())
      );
    }
  }

  trackByFn(index: number, item: Utilisateur): string {
    return item._id;
  }
}
