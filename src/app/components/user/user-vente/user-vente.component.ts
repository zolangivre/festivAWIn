import { Component, Input } from '@angular/core';
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

import { UserVenteQteComponent } from '../user-vente-qte/user-vente-qte.component';

import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VenteComponent } from '../../dialogue/vente/vente.component';

@Component({
    selector: 'app-user-vente',
    imports: [
        MatTableModule,
        UserVenteQteComponent,
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
    templateUrl: './user-vente.component.html',
    styleUrl: './user-vente.component.css'
})
export class UserVenteComponent {
  @Input() utilisateur!: Utilisateur;
  vendeurs: Utilisateur[] = [];
  availableGames: JeuDepot[] = [];
  selectedGames = new MatTableDataSource<VenteJeu>();
  totalAmount: number = 0;
  selectedGameForQuantity: JeuDepot | null = null;
  vendeurForm: FormGroup;
  sessionActive!: Session;

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

  onVendeurChange(vendeurId: string): void {
    this.fetchAvailableGames(vendeurId);
    this.selectedGames.data = [];
    this.totalAmount = 0;
  }

  fetchAvailableGames(vendeurId: string): void {
    this.itemService.getItemsByUser(vendeurId).subscribe((games) => {
      this.availableGames = games.filter(
        (game) => game.quantiteJeu > 0 && game.statutJeu === 'Disponible'
      );
    });
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
        this.totalAmount -= jeuDepot.prixJeu * removedGame.quantiteVendus;
      }
      // Remet à jour la quantité dans availableGames
      const availableGame = this.availableGames.find(
        (game) => game._id === removedGame.idJeuDepot
      );
      if (availableGame) {
        availableGame.quantiteJeu += removedGame.quantiteVendus;
      }
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
        console.log('Session active :', this.sessionActive);
        const commission = parseFloat((this.totalAmount * Number(this.sessionActive.commission) / 100).toFixed(2));
        console.log('Commission :', commission);
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

  // DEfini le jeu selectionné
  defineQuantitySelector(game: JeuDepot): void {
    this.selectedGameForQuantity = game;
  }

  handleQuantitySelection(event: { game: JeuDepot; quantity: number }): void {
    const { game, quantity } = event;

    const selectedGameIndex = this.selectedGames.data.findIndex(
      (g) => g.idJeuDepot === game._id
    );

    if (selectedGameIndex > -1) {
      // Jeu déjà présent : augmenter la quantité
      this.selectedGames.data[selectedGameIndex].quantiteVendus += quantity;
      console.log(
        'Jeu déjà présent :',
        this.selectedGames.data[selectedGameIndex]
      );
    } else {
      // Ajouter le jeu avec la quantité
      const venteJeu = this.convertJeuDepotToVenteJeu(game, quantity);
      this.itemService.getJeuDepot(game._id).subscribe((jeuDepot) => {
        venteJeu.jeuNom = jeuDepot.nomJeu;
        venteJeu.editeurNom = jeuDepot.editeurJeu;
        venteJeu.prixJeu = jeuDepot.prixJeu;
      });
      this.selectedGames.data = [...this.selectedGames.data, venteJeu];
      console.log('Jeu ajouté aux jeux selectionnés:', {
        ...game,
        quantiteJeu: quantity,
      });
    }
    this.availableGames = this.availableGames.map((availableGame) => {
      if (availableGame._id === game._id) {
        return {
          ...availableGame,
          quantiteJeu: availableGame.quantiteJeu - quantity,
        };
      }
      return availableGame;
    });
    this.totalAmount += game.prixJeu * quantity;
    this.selectedGameForQuantity = null;
  }

  cancelQuantitySelection(): void {
    this.selectedGameForQuantity = null;
  }

  goBack(): void {
    window.history.back();
  }
}
