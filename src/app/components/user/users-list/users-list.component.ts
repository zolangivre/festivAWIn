import { Component, Input, SimpleChanges } from '@angular/core';
import { Utilisateur } from '../../../models/user';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { MatTableModule } from '@angular/material/table';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [UserDetailsComponent, MatTableModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})

export class UsersListComponent {
  @Input() utilisateurs: Utilisateur[] = [];
  utilisateur!: Utilisateur;
  dataSource = this.utilisateurs;
  displayedColumns: string[] = ['nom', 'prenom', 'mail', 'telephone', 'adresse', 'role'];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(utilisateurs => this.utilisateurs = utilisateurs);
  }
}
