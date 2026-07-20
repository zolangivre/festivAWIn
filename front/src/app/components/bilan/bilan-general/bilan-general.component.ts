import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vente } from '../../../models/vente';

import { VenteService } from '../../../services/vente.service';
import { SessionService } from '../../../services/session.service';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute } from '@angular/router';
import { JeuDepot } from '../../../models/item';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Session } from '../../../models/session';


@Component({
  selector: 'app-bilan-general',
  imports: [
    MatCardModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './bilan-general.component.html',
  styleUrl: './bilan-general.component.css'
})
export class BilanGeneralComponent {
  sessionId: string | null = null;
  session!: Session;
  tresorerieTotale: number = 0;
  sommesDuesVendeurs: number = 0;
  fraisDepotEncaisses: number = 0;
  fraisDepotRemises: number = 0;
  commissionPrelevee: number = 0;
  nbVentes: number = 0;
  nbDepots: number = 0;
  nbJeuDisponible: number = 0;
  nbJeuVendu: number = 0;
  nbJeuDepose: number = 0;
  montantTotalJeuDepot: number = 0;

  constructor(
    private route: ActivatedRoute,
    private venteService: VenteService,
    private itemService: ItemService,
    private sessionService: SessionService,
  ) { }

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('idSession');
    if (this.sessionId) {
      this.sessionService.getSessionById(this.sessionId).subscribe((session) => {
        this.session = session;
        this.venteService.getVentes().subscribe((ventes) => {
          const ventesFiltrees = ventes.filter((vente: Vente) => {
            const dateVente = new Date(vente.dateVente);
            return dateVente >= new Date(session.dateDebut) && dateVente <= new Date(session.dateFin);
          });
          ventesFiltrees.forEach((vente: Vente) => {
            this.nbVentes++;
            this.sommesDuesVendeurs += vente.montantTotal;
            this.commissionPrelevee += vente.commissionVente;
          });
        });
        this.itemService.getAllItems().subscribe((items) => {
          const itemsFiltrees = items.filter((item: JeuDepot) => {
            const dateDepot = new Date(item.dateDepot);
            return dateDepot >= new Date(session.dateDebut) && dateDepot <= new Date(session.dateFin);
          }
          );
          itemsFiltrees.forEach((item: JeuDepot) => {
            this.nbDepots++;
            this.nbJeuDisponible += item.quantiteJeuDisponible;
            this.nbJeuVendu += item.quantiteJeuVendu;
            this.nbJeuDepose += item.quantiteJeuDisponible + item.quantiteJeuVendu;
            this.fraisDepotEncaisses +=
              item.fraisDepot *
              (item.quantiteJeuDisponible + item.quantiteJeuVendu) -
              (item.fraisDepot *
                (item.quantiteJeuDisponible + item.quantiteJeuVendu) * item.remiseDepot / 100);
            this.fraisDepotRemises += item.fraisDepot *
              (item.quantiteJeuDisponible + item.quantiteJeuVendu) * item.remiseDepot / 100;
            this.montantTotalJeuDepot +=
              (item.quantiteJeuDisponible + item.quantiteJeuVendu) * item.prixJeu;
          }
          );
          this.tresorerieTotale = this.fraisDepotEncaisses + this.commissionPrelevee;
        });
      });
    }
  }
}
