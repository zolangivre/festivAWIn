import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Utilisateur } from '../../../models/user';
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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatButtonModule, MatTableModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})

export class UserEditComponent implements OnChanges{
  @Input() utilisateur!: Utilisateur;
  userForm: FormGroup;

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
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUtilisateur');
      if (id) {
        this.usersService.getUser(+id).subscribe(utilisateur => {
          this.utilisateur = utilisateur;
          this.userForm.patchValue(utilisateur);
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.utilisateur) {
      this.userForm.patchValue({
        nom: this.utilisateur.nom,
        prenom: this.utilisateur.prenom,
        mail: this.utilisateur.mail,
        telephone: this.utilisateur.telephone,
        adresse: this.utilisateur.adresse,
        role: this.utilisateur.role,
      });
    }
  }

  updateUser(): void {
    if (this.userForm.valid && this.utilisateur) {
      this.utilisateur.nom = this.userForm.value.nom;
      this.utilisateur.prenom = this.userForm.value.prenom;
      this.utilisateur.mail = this.userForm.value.mail;
      this.utilisateur.telephone = this.userForm.value.telephone;
      this.utilisateur.adresse = this.userForm.value.adresse;
      this.utilisateur.role = this.userForm.value.role;
    }
  }
}
