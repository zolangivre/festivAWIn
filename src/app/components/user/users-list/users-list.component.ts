import { Component } from '@angular/core';

import { Utilisateur } from '../../../models/user';
import { UserDetailsComponent } from '../user-details/user-details.component';
import { UsersService } from '../../../services/users.service';
import { AuthService } from '../../../services/auth.service';

import { MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Router , ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-users-list',
  imports: [
    UserDetailsComponent,
    MatTableModule,
    MatButton,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent {
  utilisateurs: Utilisateur[] = [];
  utilisateur!: Utilisateur;
  selectedRole: string = 'all';
  selectedUser: Utilisateur | null = null;
  editMode: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.getUsers();
    this.route.queryParams.subscribe((params) => {
      const userId = params['idUtilisateur'];
      if (userId) {
        this.usersService.getUser(userId).subscribe((user) => {
          this.selectedUser = user;
        });
      }
    });
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
    this.router.navigate(['utilisateur/add']);
  }

  filterUsers(role: string): void {
    this.selectedRole = role;
    this.getUsers();
  }

  showDetails(utilisateur: Utilisateur): void {
    this.selectedUser = utilisateur;
    this.router.navigate([], {
      queryParams: { idUtilisateur: utilisateur._id },
    });
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
}
