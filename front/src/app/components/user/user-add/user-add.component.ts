import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { UsersService } from '../../../services/users.service';
import { BilanService } from '../../../services/bilan.service';
import { Utilisateur } from '../../../models/user'

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css',
})
export class UserAddComponent {
  userForm: FormGroup;
  roles: string[] = ['Vendeur', 'Acheteur'];

  constructor(
    private usersService: UsersService,
    private bilanService: BilanService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      telephone: [
        '',
        [Validators.pattern('^[0-9]*$'), Validators.minLength(10)],
      ],
      adresse: ['', [Validators.pattern, Validators.minLength(2)]],
      ville: ['', [Validators.pattern, Validators.minLength(2)]],
      codePostal: [
        '',
        [Validators.pattern('^[0-9]*$'), Validators.minLength(5)],
      ],
      pays: ['', [Validators.pattern, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  addUser(): void {
    if (this.userForm.valid) {
      this.usersService.addUser(this.userForm.value).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur ajouté avec succès', 'Fermer', {
            duration: 3000,
          });
          this.router.navigate(['/utilisateur']);
          this.userForm.reset();
        },
        error: (err: any) => {
          this.snackBar.open(
            "Erreur lors de l'ajout de l'utilisateur",
            'Fermer',
            {
              duration: 3000,
            }
          );
          console.error("Erreur lors de l'ajout de l'utilisateur:", err);
        },
      });
    }
  }
}
