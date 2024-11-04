import {
  Component,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Utilisateur } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { UserDetailsComponent } from '../user-details/user-details.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { JeuDepot } from '../../../models/item';

@Component({
  selector: 'app-user-depot',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    UserDetailsComponent,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './user-depot.component.html',
  styleUrl: './user-depot.component.css',
})
export class UserDepotComponent {
  jeuDepotForm: FormGroup;
  depotList: JeuDepot[] = [];
  jeux = this.depotList;
  @Input() utilisateur!: Utilisateur;
  displayedColumns: string[] = [
    'nomJeu',
    'editeurJeu',
    'prixJeu',
    'quantiteJeu',
  ];
  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.jeuDepotForm = this.fb.group({
      nomJeu: ['', [Validators.required, Validators.minLength(2)]],
      editeurJeu: ['', [Validators.required, Validators.minLength(2)]],
      prixJeu: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      quantiteJeu: ['', [Validators.required, Validators.pattern('^[1-9]*$')]],
    });
  }

  addJeu(): void {
    if (this.jeuDepotForm.valid) {
      this.depotList.push(this.jeuDepotForm.value);
      this.jeux = [...this.depotList];
      this.jeuDepotForm.reset();
      this.cdr.detectChanges();
    }
  }

  deleteJeu(): void {
    this.depotList.pop();
    this.jeux = [...this.depotList];
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    // Handle form submission
  }
}
