import { Component } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatButtonModule, MatTableModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})

export class UserAddComponent {
  userForm: FormGroup;
  roles: string[] = ['Admin', 'Gestionnaire', 'Vendeur', 'Acheteur'];

  constructor(private usersService: UsersService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]*$')]],
      adresse: ['', [Validators.pattern, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  addUser(): void {
    this.usersService.addUser(this.userForm.value).subscribe(() => {
      this.userForm.reset();
    });
  }
}
