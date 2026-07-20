import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenteService } from '../../../services/vente.service';
import { VenteJeuService } from '../../../services/vente-jeu.service';
import { Utilisateur } from '../../../models/user';
import { Vente } from '../../../models/vente';

@Component({
  selector: 'app-bilan-acheteur',
  imports: [CommonModule],
  templateUrl: './bilan-acheteur.component.html',
  styleUrl: './bilan-acheteur.component.css',
})
export class BilanAcheteurComponent implements OnChanges {
  @Input() utilisateur!: Utilisateur;
  sommesDepenses: number = 0;
  nbJeuAchete: number = 0;
  nbAchat: number = 0;

  constructor(
    private venteService: VenteService,
    private venteJeuService: VenteJeuService
  ) {}

  ngOnInit(): void {
    this.sommesDepenses = 0;
    this.nbJeuAchete = 0;
    this.nbAchat = 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['utilisateur'] && this.utilisateur) {
      this.updateBilan();
    }
  }

  updateBilan(): void {
    this.sommesDepenses = 0;
    this.nbJeuAchete = 0;
    this.nbAchat = 0;
    this.venteService
      .getVentesByAcheteurId(this.utilisateur._id)
      .subscribe((achats) => {
        this.nbAchat = achats.length;
        achats.forEach((achat: Vente) => {
          this.sommesDepenses += achat.montantTotal;
          this.venteJeuService
            .getJeuxByVenteId(achat._id)
            .subscribe((venteJeux) => {
              this.nbJeuAchete = venteJeux.length;
            });
        });
      });
  }
}