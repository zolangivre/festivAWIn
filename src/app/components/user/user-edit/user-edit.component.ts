import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatIconModule, MatDividerModule, MatButtonModule, MatTableModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})

export class UserEditComponent {
  utilisateur!: Utilisateur;
  userForm: FormGroup;
  roles: string[] = ['Admin', 'Gestionnaire', 'Vendeur', 'Acheteur'];
  constructor(private usersService: UsersService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]*$')]],
      adresse: ['', [Validators.pattern, Validators.minLength(2)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

/*   ngOnInit(): void {
    console.log(this.utilisateur); 
    this.route.paramMap.subscribe(params => {
      const id = params.get('idUtilisateur');
      console.log(id);
      if (id) {
        this.usersService.getUser(+id).subscribe(
          utilisateur => {
            this.utilisateur = utilisateur;
            this.userForm.patchValue(utilisateur);
          },
          error => {
            console.error('Erreur lors de la récupération de l\'utilisateur', error);
          }
        );
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
  } */
  
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { utilisateur: Utilisateur };

    if (state && state.utilisateur) {
      this.utilisateur = state.utilisateur;
      this.userForm.patchValue(this.utilisateur);
    } else {
      this.route.paramMap.subscribe(params => {
        const id = params.get('idUtilisateur');
        if (id) {
          this.usersService.getUser(+id).subscribe({
            next: (utilisateur) => {
              this.utilisateur = utilisateur;
              this.userForm.patchValue(utilisateur);
            },
            error: (error) => {
              console.error('Erreur lors de la récupération de l\'utilisateur', error);
            },
            complete: () => {
              console.log('Récupération de l\'utilisateur terminée');
            }
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.utilisateur, ...this.userForm.value };
      this.usersService.updateUser(updatedUser).subscribe({
        next: () => {
          console.log('Utilisateur mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      });
    }
  }
}
