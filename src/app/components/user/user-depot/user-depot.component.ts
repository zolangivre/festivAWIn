import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Utilisateur } from '../../../models/user';
import { UsersService } from '../../../services/users.service';
import { ItemService } from '../../../services/item.service';

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
    'fraisDepot',
    'remiseDepot',
  ];

  constructor(
    private usersService: UsersService,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.jeuDepotForm = this.fb.group({
      nomJeu: ['', [Validators.required, Validators.minLength(2)]],
      editeurJeu: ['', [Validators.required, Validators.minLength(2)]],
      prixJeu: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      quantiteJeu: ['', [Validators.required, Validators.pattern('^[1-9]*$')]],
      remiseDepot: ['', [Validators.required, Validators.pattern('^[1-9]*$')]],
    });
  }

  ngOnInit(): void {
    // Récupérer l'utilisateur correspondant à partir de l'ID dans l'URL
    const userId = this.route.snapshot.paramMap.get('idUtilisateur');
    if (userId) {
      this.usersService.getUser(userId).subscribe((user) => {
        this.utilisateur = user;
        console.log(this.utilisateur);
      });
    } else {
      console.error('User ID is null');
    }
  }

  addJeu(): void {
    if (this.jeuDepotForm.valid) {
      this.depotList.push(this.jeuDepotForm.value);
      this.depotList[this.depotList.length - 1].fraisDepot = parseFloat(
        (this.depotList[this.depotList.length - 1].prixJeu * 0.15).toFixed(3)
      );
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

  makeDeposit(): void {
    for (let i = 0; i < this.depotList.length; i++) {
      this.depotList[i].vendeur = this.utilisateur._id;
      this.depotList[i].statutJeu = 'Disponible';
      this.depotList[i].dateDepot = new Date().toLocaleDateString();
      this.itemService.addItem(this.depotList[i]).subscribe();
    }
    this.depotList = [];
    this.jeux = [];
  }

  goBack(): void {
    window.history.back();
  }
}
