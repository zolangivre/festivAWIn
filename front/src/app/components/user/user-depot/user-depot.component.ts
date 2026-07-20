import { Component, ChangeDetectorRef, AfterViewInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';

import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-user-depot',
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
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './user-depot.component.html',
  styleUrl: './user-depot.component.css',
})
export class UserDepotComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  jeuDepotForm: FormGroup;
  depotListDataSource: MatTableDataSource<JeuDepot> =
    new MatTableDataSource<JeuDepot>([]);
  depotList: JeuDepot[] = [];
  jeux = this.depotList;
  utilisateur!: Utilisateur;
  sessionActive!: Session;
  displayedColumns: string[] = [
    'nomJeu',
    'editeurJeu',
    'prixJeu',
    'quantiteJeuDisponible',
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
    private snackBar: MatSnackBar
  ) {
    this.jeuDepotForm = this.fb.group({
      nomJeu: ['', [Validators.required, Validators.minLength(2)]],
      editeurJeu: ['', [Validators.required, Validators.minLength(2)]],
      prixJeu: [
      '',
      [Validators.required, Validators.pattern('^-?\\d*(\\.\\d+)?$')],
      ],
      quantiteJeuDisponible: ['', [Validators.required, Validators.min(1), Validators.pattern('^-?\\d+$')]],
      remiseDepot: [
      '',
      [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^-?\\d*(\\.\\d+)?$')],
      ],
    });
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    // Récupérer l'utilisateur correspondant à partir de l'ID dans l'URL
    const userId = this.route.snapshot.paramMap.get('idUtilisateur');
    if (userId) {
      this.usersService.getUser(userId).subscribe((user) => {
        this.utilisateur = user;
      });
    } else {
      console.error('User ID is null');
    }
    // Récupérer la session en cours
    this.sessionService.getSessionEnCours().subscribe((session) => {
      this.sessionActive = session;
    });
  }

  ngAfterViewInit() {
    this.depotListDataSource.sort = this.sort;
    this.depotListDataSource.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  addJeu(): void {
    if (this.jeuDepotForm.valid) {
      this.frais_apres_remise = 0;
      this.frais_jeu_totale = 0;
      this.depotList.push(this.jeuDepotForm.value);
      this.depotListDataSource.data = this.depotList;
      this.depotListDataSource.sort = this.sort;
      this.depotListDataSource.paginator = this.paginator;
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
        this.depotList[this.depotList.length - 1].quantiteJeuDisponible;
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
    this.depotListDataSource.data = this.depotList;
    this.tabFraisDepot.pop();
    if (this.depotList.length === 0) {
      this.depot_vide = true;
    }
    this.jeux = [...this.depotList];
    this.cdr.detectChanges();
  }

  makeDeposit(): void {
    for (let i = 0; i < this.tabFraisDepot.length; i++) {
      this.somme_frais_depot = parseFloat(
        (this.somme_frais_depot + this.tabFraisDepot[i]).toFixed(3)
      );
    }
    const dialogRef = this.dialog.open(DepotComponent, {
      data: { sommeFraisDepot: this.somme_frais_depot },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        for (let i = 0; i < this.depotList.length; i++) {
          this.depotList[i].vendeur = this.utilisateur._id;
          this.depotList[i].statutJeu = 'Disponible';
          this.depotList[i].quantiteJeuVendu = 0;
          this.itemService.addItem(this.depotList[i]).subscribe();
        }
        this.bilanService.getBilanById(this.utilisateur._id).subscribe({
          next: (bilan) => {
            this.bilanService
              .updateBilan(bilan._id, {
                ...bilan,
                sommeDues: bilan.sommeDues + this.somme_frais_depot,
                totalFrais: bilan.totalFrais + this.somme_frais_depot,
              })
              .subscribe({
                next: () => console.log('Bilan mis à jour avec succès'),
                error: (err) =>
                  console.error(
                    'Erreur lors de la mise à jour du bilan :',
                    err
                  ),
              });
          },
          error: (err) =>
            console.error('Erreur lors de la récupération du bilan :', err),
        });
        this.depotList = [];
        this.depotListDataSource.data = this.depotList;
        this.jeux = [];
        this.snackBar.open('Dépôt effectué avec succès', 'Fermer', {
          duration: 3000,
        });
        this.depot_vide = true;
      } else {
        this.snackBar.open('Dépôt annulé', 'Fermer', {
          duration: 3000,
        });
        this.somme_frais_depot = 0;
      }
    });
  }
}
