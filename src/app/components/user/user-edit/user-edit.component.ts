import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Utilisateur } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { EditComponent } from '../../dialogue/edit/edit.component';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-user-edit',
    imports: [
        CommonModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        MatTableModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatDialogModule,
    ],
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  @Input() utilisateur!: Utilisateur;
  @Output() userUpdated = new EventEmitter<Utilisateur>();
  userForm: FormGroup;
  roles: string[] = ['Vendeur', 'Acheteur'];

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
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
    const dialogRef = this.dialog.open(EditComponent);
    if (this.userForm.valid) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const updatedUser = {
            ...this.utilisateur,
            ...this.userForm.value,
          };
          this.usersService.updateUser(updatedUser).subscribe({
            next: () => {
              this.userUpdated.emit(updatedUser);
              this.snackBar.open('Modifications effectué avec succès', 'Fermer', {
                duration: 3000,
              });
            },
            error: (error) => {
              console.error(
                "Erreur lors de la mise à jour de l'utilisateur",
                error
              );
            },
          });
        }
      });
    }
  }
}
