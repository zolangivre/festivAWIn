import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { Utilisateur } from '../../../models/user';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatButtonModule, MatTableModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})

export class UserDetailsComponent {
  @Input() utilisateur!: Utilisateur;
  @Output() utilisateurs: Utilisateur[] = [];
  @Output() deleteUserEvent = new EventEmitter<Utilisateur>();
  displayedColumns: string[] = ['nom', 'prenom', 'mail', 'telephone', 'adresse', 'role'];

  constructor() {
  }
}
