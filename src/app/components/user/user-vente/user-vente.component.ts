import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Utilisateur } from '../../../models/user';
import { JeuDepot } from '../../../models/item';
import { VenteJeu } from '../../../models/vente-jeu';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserVenteQteComponent } from "../user-vente-qte/user-vente-qte.component";
import { CommonModule } from '@angular/common';
import { VenteService } from '../../../services/vente.service';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-vente',
  standalone: true,
  imports: [MatTableModule, UserVenteQteComponent, CommonModule, MatButtonModule],
  templateUrl: './user-vente.component.html',
  styleUrl: './user-vente.component.css',
})
export class UserVenteComponent {
  @Input() utilisateur!: Utilisateur;
  availableGames: JeuDepot[] = [];
  selectedGames = new MatTableDataSource<VenteJeu>();
  totalAmount: number = 0;
  selectedGameForQuantity: JeuDepot | null = null;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private venteService: VenteService,
    private cdr: ChangeDetectorRef
  ) {
    this.fetchAvailableGames();
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
  }

  fetchAvailableGames(): void {
    this.itemService.getItems().subscribe((games) => {
      this.availableGames = games.filter(
        (game) => game.quantiteJeu > 0 && game.statutJeu === 'Disponible'
      );
      this.cdr.detectChanges();
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
    }
  }

  makePurchase(): void {
    // Créer la vente (appeler le service Vente)
    const acheteurId = this.utilisateur._id;
    const selectedGame = this.availableGames.find(
      (game) => game._id === this.selectedGames.data[0]?.idJeuDepot
    );
    if (!selectedGame || !selectedGame.vendeur) {
      console.error('Jeu ou vendeur introuvable pour effectuer la vente.');
      return;
    }
    const vendeurId = selectedGame.vendeur;

    const jeuxVendus: VenteJeu[] = this.selectedGames.data.map(
      (venteJeu) =>
        new VenteJeu(
          '', // _id généré par le backend
          venteJeu.idJeuDepot,
          '', // idVente sera aussi généré par le backend
          venteJeu.quantiteVendus
        )
    );

    console.log('Données envoyées (front) :', {
      acheteurId,
      vendeurId,
      montantTotal: this.totalAmount,
      jeuxVendus,
    });

    this.venteService
      .createVente(
        acheteurId,
        vendeurId,
        this.totalAmount,
        10 /* commission vente TODO */,
        jeuxVendus
      )
      .subscribe({
        next: (response) => {
          console.log('Vente créée avec succès:', response);
          this.selectedGames.data = [];
          this.totalAmount = 0;
          this.fetchAvailableGames();
        },
        error: (err) => {
          console.error('Erreur lors de la création de la vente:', err);
          console.log("Détails de l'erreur:", err.error);
        },
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
      this.selectedGames.data = [...this.selectedGames.data, venteJeu];
      console.log('Jeu ajouté aux jeux selectionnés:', {
        ...game,
        quantiteJeu: quantity,
      });
    }

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
