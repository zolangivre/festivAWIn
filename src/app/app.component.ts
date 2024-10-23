import { Component, OnInit } from '@angular/core';
import { Utilisateur } from './models/user';
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { UsersService } from './services/users.service';
import { UserDetailsComponent } from './components/user/user-details/user-details.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RootComponent } from './components/root/root.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RootComponent, UsersListComponent, UserDetailsComponent, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'fetivAWIn';
  utilisateurs: Utilisateur[] = [];
  selectedUser: Utilisateur | null = null;

  constructor( private usersService: UsersService) {}

  ngOnInit(): void {
    console.log('AppComponent initialized');
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(utilisateurs => this.utilisateurs = utilisateurs);
  }

  selectUser(utilisateur: Utilisateur) {
    this.selectedUser = utilisateur;
  }
}
