import { Component, Input, AfterViewInit, ViewChild, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Utilisateur } from '../../../models/user';
import { JeuDepot } from '../../../models/item';
import { VenteJeu } from '../../../models/vente-jeu';
import { Session } from '../../../models/session';

import { ItemService } from '../../../services/item.service';
import { UsersService } from '../../../services/users.service';
import { VenteService } from '../../../services/vente.service';
import { BilanService } from '../../../services/bilan.service';
import { SessionService } from '../../../services/session.service';

import { SelectionQuantiteComponent } from '../../dialogue/selection-quantite/selection-quantite.component';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VenteComponent } from '../../dialogue/vente/vente.component';

import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-user-vente',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './user-vente.component.html',
  styleUrl: './user-vente.component.css',
})
export class UserVenteComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  @Input() utilisateur!: Utilisateur;
  vendeurs: Utilisateur[] = [];
  availableGames: JeuDepot[] = [];
  availableGamesDataSource = new MatTableDataSource<JeuDepot>();
  selectedGames = new MatTableDataSource<VenteJeu>();
  totalAmount: number = 0;
  vendeurForm: FormGroup;
  sessionActive!: Session;

  @ViewChild('availablesGamesSort') availablesGamesSort!: MatSort;
  @ViewChild('availablesGamesPaginator') availablesGamesPaginator!: MatPaginator;
  @ViewChild('selectedGamesSort') selectedGamesSort!: MatSort;
  @ViewChild('selectedGamesPaginator') selectedGamesPaginator!: MatPaginator;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private venteService: VenteService,
    private bilanService: BilanService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.vendeurForm = this.fb.group({
      vendeur: [''],
    });
  }

  ngOnInit(): void {
    this.usersService.getVendeurs().subscribe((vendeurs) => {
      this.vendeurs = vendeurs;
    });

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
    this.availableGamesDataSource.sort = this.availablesGamesSort;
    this.availableGamesDataSource.paginator = this.availablesGamesPaginator;
    this.selectedGames.sort = this.selectedGamesSort;
    this.selectedGames.paginator = this.selectedGamesPaginator;
  }

  onVendeurChange(vendeurId: string): void {
    this.fetchAvailableGames(vendeurId);
    this.selectedGames.data = [];
    this.totalAmount = 0;
  }

  fetchAvailableGames(vendeurId: string): void {
    this.itemService.getItemsByUser(vendeurId).subscribe((games) => {
      this.availableGames = games.filter(
        (game) =>
          game.quantiteJeuDisponible > 0 && game.statutJeu === 'Disponible'
      );
      this.availableGamesDataSource = new MatTableDataSource<JeuDepot>(
        this.availableGames
      );
      this.availableGamesDataSource.sort = this.availablesGamesSort;
      this.availableGamesDataSource.paginator = this.availablesGamesPaginator;
    });
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

  convertJeuDepotToVenteJeu(
    jeuDepot: JeuDepot,
    quantiteVendus: number
  ): VenteJeu {
    return new VenteJeu(
      '', // L'id sera généré par le backend
      jeuDepot._id,
      '', // L'ID de la vente (sera défini après la création de la vente)
      quantiteVendus
    );
  }

  removeGameFromPurchase(venteJeu: VenteJeu): void {
    const currentData = this.selectedGames.data;
    const index = currentData.findIndex(
      (g) => g.idJeuDepot === venteJeu.idJeuDepot
    );
    if (index > -1) {
      const removedGame = currentData[index];
      currentData.splice(index, 1);
      this.selectedGames.data = [...currentData];

      // Mettre à jour le montant total
      const jeuDepot = this.availableGames.find(
        (game) => game._id === removedGame.idJeuDepot
      );
      if (jeuDepot) {
        this.totalAmount = parseFloat(
          (
            this.totalAmount -
            jeuDepot.prixJeu * removedGame.quantiteVendus
          ).toFixed(2)
        );
      }
      // Remet à jour la quantité dans availableGames
      const availableGame = this.availableGames.find(
        (game) => game._id === removedGame.idJeuDepot
      );
      if (availableGame) {
        availableGame.quantiteJeuDisponible += removedGame.quantiteVendus;
      }
      this.availableGamesDataSource.data = [...this.availableGames];
    }
  }

  makePurchase(): void {
    const dialogRef = this.dialog.open(VenteComponent, {
      data: { montantTotal: this.totalAmount },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const acheteurId = this.utilisateur._id;
        const selectedGame = this.availableGames.find(
          (game) => game._id === this.selectedGames.data[0]?.idJeuDepot
        );

        if (!selectedGame || !selectedGame.vendeur) {
          console.error('Jeu ou vendeur introuvable pour effectuer la vente.');
          this.snackBar.open('Jeu ou vendeur introuvable.', 'Fermer', {
            duration: 3000,
          });
          return;
        }

        const vendeurId = selectedGame.vendeur;

        const jeuxVendus: VenteJeu[] = this.selectedGames.data.map(
          (venteJeu) =>
            new VenteJeu(
              '', // _id généré par le backend
              venteJeu.idJeuDepot,
              '', // idVente généré par le backend
              venteJeu.quantiteVendus
            )
        );
        const commission = parseFloat(
          (
            (this.totalAmount * Number(this.sessionActive.commission)) /
            100
          ).toFixed(2)
        );
        this.venteService
          .createVente(
            acheteurId,
            vendeurId,
            this.totalAmount,
            commission,
            jeuxVendus
          )
          .pipe(
            switchMap((response) => {
              console.log('Vente créée avec succès :', response);
              return this.bilanService.getBilanById(vendeurId);
            }),
            switchMap((bilan) => {
              console.log('Bilan récupéré :', bilan);

              const updatedBilan = {
                ...bilan,
                sommeDues: bilan.sommeDues + commission,
                totalCommissions: bilan.totalCommissions + commission,
                gains: bilan.gains + this.totalAmount,
              };

              return this.bilanService.updateBilan(bilan._id, updatedBilan);
            }),
            switchMap(() => {
              // Mettre à jour les quantités des jeux vendus
              const updateObservables = this.selectedGames.data
                .map((venteJeu) => {
                  const jeuDepot = this.availableGames.find(
                    (game) => game._id === venteJeu.idJeuDepot
                  );
                  console.log('vente jeu vendu', venteJeu.quantiteVendus);
                  if (jeuDepot) {
                    jeuDepot.quantiteJeuVendu += venteJeu.quantiteVendus;
                    return this.itemService.updateJeuDepot(jeuDepot);
                  }
                  return null;
                })
                .filter((obs) => obs !== null);

              return forkJoin(updateObservables);
            })
          )
          .subscribe({
            next: () => {
              this.snackBar.open('Achat effectué avec succès', 'Fermer', {
                duration: 3000,
              });
              this.selectedGames.data = [];
              this.totalAmount = 0;
            },
            error: (err) => {
              console.error('Erreur lors de l’opération :', err);
              this.snackBar.open('Une erreur est survenue.', 'Fermer', {
                duration: 3000,
              });
            },
          });
      }
    });
  }

  handleQuantitySelection(game: JeuDepot): void {
    const dialogRef = this.dialog.open(SelectionQuantiteComponent, {
      width: '400px',
      data: { game },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: { game: JeuDepot; quantity: number } | undefined) => {
        if (result) {
          const { game, quantity } = result;

          const selectedGameIndex = this.selectedGames.data.findIndex(
            (g) => g.idJeuDepot === game._id
          );

          if (selectedGameIndex > -1) {
            // Jeu déjà présent : augmenter la quantité
            this.selectedGames.data[selectedGameIndex].quantiteVendus +=
              quantity;
          } else {
            // Ajouter le jeu avec la quantité
            const venteJeu = this.convertJeuDepotToVenteJeu(game, quantity);
            this.itemService.getJeuDepot(game._id).subscribe((jeuDepot) => {
              venteJeu.jeuNom = jeuDepot.nomJeu;
              venteJeu.editeurNom = jeuDepot.editeurJeu;
              venteJeu.prixJeu = jeuDepot.prixJeu;
            });
            this.selectedGames.data = [...this.selectedGames.data, venteJeu];
          }
          this.availableGames = this.availableGames.map((availableGame) => {
            if (availableGame._id === game._id) {
              return {
                ...availableGame,
                quantiteJeuDisponible:
                  availableGame.quantiteJeuDisponible - quantity,
              };
            }
            return availableGame;
          });
          this.availableGamesDataSource.data = [...this.availableGames];

          this.totalAmount = parseFloat(
            (this.totalAmount + game.prixJeu * quantity).toFixed(2)
          );
          this.selectedGames.sort = this.selectedGamesSort;
          this.selectedGames.paginator = this.selectedGamesPaginator;
        }
      });
  }
}
