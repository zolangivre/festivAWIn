import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { Utilisateur } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { UserDepotComponent } from '../user-depot/user-depot.component';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatButtonModule, MatTableModule, ReactiveFormsModule, UserDepotComponent],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit{
  @Input() utilisateur!: Utilisateur;
  @Output() userUpdated = new EventEmitter<Utilisateur>();
  userForm: FormGroup;
  roles: string[] = ['Admin', 'Gestionnaire', 'Vendeur', 'Acheteur'];

  constructor(private usersService: UsersService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]*$')]],
      adresse: ['', [Validators.pattern, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    if (this.utilisateur) {
      this.userForm.patchValue(this.utilisateur);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.utilisateur, ...this.userForm.value };
      this.usersService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Utilisateur mis à jour avec succès');
          this.userUpdated.emit(updatedUser);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      });
    }
  }
}
