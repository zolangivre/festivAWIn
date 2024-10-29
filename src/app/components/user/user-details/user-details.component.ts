import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { Utilisateur } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatButtonModule, MatTableModule, ReactiveFormsModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})

export class UserDetailsComponent implements OnChanges {
  @Input() utilisateur!: Utilisateur;
  @Output() userDeleted = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<Utilisateur>();
  userForm: FormGroup;
  displayedColumns: string[] = ['nom', 'prenom', 'mail', 'telephone', 'adresse', 'role'];
  editMode: boolean = false;
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

  ngOnChanges(): void {
    this.editMode = false;
    if (this.utilisateur) {
      this.userForm.patchValue(this.utilisateur);
    }
  }

  refreshUserDetails(): void {
    const userId = this.utilisateur._id;
    if (userId) {
      this.usersService.getUser(userId).subscribe({
        next: (user) => {
          this.utilisateur = user;
          console.log('Détails de l\'utilisateur rafraîchis avec succès');
        },
        error: (error) => {
          console.error('Erreur lors du rafraîchissement des détails de l\'utilisateur', error);
        }
      });
    } else {
      console.error('ID utilisateur non valide');
    }
  }
  
  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.utilisateur, ...this.userForm.value };
      this.usersService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Utilisateur mis à jour avec succès');
          this.editMode = false;
          this.refreshUserDetails();
          this.userUpdated.emit(updatedUser);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      });
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
