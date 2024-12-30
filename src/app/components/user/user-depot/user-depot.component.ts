import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { Utilisateur } from '../../../models/user';
import { JeuDepot } from '../../../models/item';
import { Session } from '../../../models/session';

import { UsersService } from '../../../services/users.service';
import { ItemService } from '../../../services/item.service';
import { SessionService } from '../../../services/session.service';
import { BilanService } from '../../../services/bilan.service';

import { DepotComponent } from '../../dialogue/depot/depot.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-depot.component.html',
  styleUrl: './user-depot.component.css',
})
export class UserDepotComponent {
  jeuDepotForm: FormGroup;
  depotList: JeuDepot[] = [];
  jeux = this.depotList;
  utilisateur!: Utilisateur;
  sessionActive!: Session;
  displayedColumns: string[] = [
    'nomJeu',
    'editeurJeu',
    'prixJeu',
    'quantiteJeu',
    'fraisDepot',
    'remiseDepot',
  ];
  tabFraisDepot: number[] = [];
  somme_frais_depot = 0;
  frais_jeu_totale = 0;
  frais_apres_remise = 0;
  depot_vide = true;

  constructor(
    private usersService: UsersService,
    private itemService: ItemService,
    private sessionService: SessionService,
    private bilanService: BilanService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.jeuDepotForm = this.fb.group({
      nomJeu: ['', [Validators.required, Validators.minLength(2)]],
      editeurJeu: ['', [Validators.required, Validators.minLength(2)]],
      prixJeu: ['', [Validators.required, Validators.pattern('^-?\\d*(\\.\\d+)?$')]],
      quantiteJeu: ['', [Validators.required, Validators.min(1)]],
      remiseDepot: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    // Récupérer l'utilisateur correspondant à partir de l'ID dans l'URL
    const userId = this.route.snapshot.paramMap.get('idUtilisateur');
    if (userId) {
      this.usersService.getUser(userId).subscribe((user) => {
        this.utilisateur = user;
        console.log(user);
      });
    } else {
      console.error('User ID is null');
    }
    // Récupérer la session en cours
    this.sessionService.getSessionEnCours().subscribe((session) => {
      this.sessionActive = session;
    });
  }

  addJeu(): void {
    if (this.jeuDepotForm.valid) {
      this.frais_apres_remise = 0;
      this.frais_jeu_totale = 0;
      this.depotList.push(this.jeuDepotForm.value);
      this.depotList[this.depotList.length - 1].fraisDepot = parseFloat(
        (
          this.depotList[this.depotList.length - 1].prixJeu *
          (Number(this.sessionActive.fraisDepot) / 100)
        ).toFixed(2)
      );
      this.jeux = [...this.depotList];
      //frais_jeu_totale est le frais totale sur un jeu cest a dire frais de depot * quantite de jeu car frais_depot est le frais unitaire du jeu
      this.frais_jeu_totale =
        this.depotList[this.depotList.length - 1].fraisDepot *
        this.depotList[this.depotList.length - 1].quantiteJeu;
      //frais_apres_remise est le frais de depot totale du jeu apres remise
      this.frais_apres_remise =
        this.frais_jeu_totale -
        this.frais_jeu_totale *
        (this.depotList[this.depotList.length - 1].remiseDepot / 100);
      this.tabFraisDepot.push(this.frais_apres_remise);
      this.depot_vide = false;
      this.jeuDepotForm.reset();
      this.cdr.detectChanges();
    }
  }

  deleteJeu(): void {
    this.depotList.pop();
    this.tabFraisDepot.pop();
    if (this.depotList.length === 0) {
      this.depot_vide = true;
    }
    this.jeux = [...this.depotList];
    this.cdr.detectChanges();
  }

  makeDeposit(): void {
    for (let i = 0; i < this.tabFraisDepot.length; i++) {
      this.somme_frais_depot = parseFloat((this.somme_frais_depot + this.tabFraisDepot[i]).toFixed(3));
    }
    const dialogRef = this.dialog.open(DepotComponent, {
      data: { sommeFraisDepot: this.somme_frais_depot },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        for (let i = 0; i < this.depotList.length; i++) {
          this.depotList[i].vendeur = this.utilisateur._id;
          this.depotList[i].statutJeu = 'Disponible';
          this.itemService.addItem(this.depotList[i]).subscribe();
        }
        this.bilanService.getBilanById(this.utilisateur._id).subscribe({
          next: (bilan) => {
            console.log('Bilan récupéré :', bilan);
            this.bilanService
              .updateBilan(bilan._id, {
                ...bilan,
                sommeDues: bilan.sommeDues + this.somme_frais_depot,
                totalFrais: bilan.totalFrais + this.somme_frais_depot,
              })
              .subscribe({
                next: () => console.log('Bilan mis à jour avec succès'),
                error: (err) =>
                  console.error('Erreur lors de la mise à jour du bilan :', err),
              });
          },
          error: (err) =>
            console.error('Erreur lors de la récupération du bilan :', err),
        });
        this.depotList = [];
        this.jeux = [];
        this.snackBar.open('Dépôt effectué avec succès', 'Fermer', {
          duration: 3000,
        });
        this.depot_vide = true;
        this.router.navigate(['utilisateur/jeu', this.utilisateur._id]);
      } else {
        this.snackBar.open('Dépôt annulé', 'Fermer', {
          duration: 3000,
        });
        this.somme_frais_depot = 0;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
