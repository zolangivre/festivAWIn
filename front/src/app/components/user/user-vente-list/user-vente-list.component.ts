import { Component, inject, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Vente } from '../../../models/vente';
import { Utilisateur } from '../../../models/user';
import { VenteService } from '../../../services/vente.service';
import { UsersService } from '../../../services/users.service';
import { VenteJeuService } from '../../../services/vente-jeu.service';
import { ItemService } from '../../../services/item.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { JeuDepot } from '../../../models/item';
import { VenteJeu } from '../../../models/vente-jeu';

@Component({
  selector: 'app-user-vente-list',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './user-vente-list.component.html',
  styleUrl: './user-vente-list.component.css',
})
export class UserVenteListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  utilisateur!: Utilisateur;
  ventes: Vente[] = [];
  jeuxVendu: VenteJeu[] = [];
  dataSource: MatTableDataSource<Vente> = new MatTableDataSource<Vente>([]);
  jeuxVenduDataSource: MatTableDataSource<VenteJeu> =
    new MatTableDataSource<VenteJeu>([]);
  selectedRow: Vente | null = null;
  displayedColumns: string[] = [
    'acheteurNom',
    'dateVente',
    'montantTotal',
    'commissionVente',
  ];

  @ViewChild('ventesSort') ventesSort!: MatSort;
  @ViewChild('ventesPaginator') ventesPaginator!: MatPaginator;
  @ViewChild('jeuxVenduSort') jeuxVenduSort!: MatSort;
  @ViewChild('jeuxVenduPaginator') jeuxVenduPaginator!: MatPaginator;

  constructor(
    private venteService: VenteService,
    private usersService: UsersService,
    private venteJeuService: VenteJeuService,
    private itemService: ItemService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('idUtilisateur');
    if (userId) {
      this.usersService.getUser(userId).subscribe((user) => {
        this.utilisateur = user;
        this.venteService.getVentesByVendeurId(userId).subscribe((ventes) => {
          this.ventes = ventes;
          this.ventes.forEach((vente) => {
            this.usersService
              .getUserById(vente.acheteur)
              .subscribe((acheteur) => {
                vente.acheteurNom = acheteur.nom + ' ' + acheteur.prenom;
              });
            this.usersService
              .getUserById(vente.vendeur)
              .subscribe((vendeur) => {
                vente.vendeurNom = vendeur.nom + ' ' + vendeur.prenom;
              });
          });
          this.dataSource = new MatTableDataSource<Vente>(this.ventes);
          this.dataSource.sort = this.ventesSort;
          this.dataSource.paginator = this.ventesPaginator;
        });
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.ventesSort;
    this.dataSource.paginator = this.ventesPaginator;
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

  showjeuxVendu(vente: Vente): void {
    this.selectedRow = vente;
    this.venteJeuService.getJeuxByVenteId(vente._id).subscribe((venteJeux) => {
      this.jeuxVendu = [];
      venteJeux.forEach((venteJeu) => {
        this.itemService
          .getJeuDepot(venteJeu.idJeuDepot)
          .subscribe((jeuDepot) => {
            this.jeuxVendu.push({
              _id: venteJeu._id,
              idJeuDepot: venteJeu.idJeuDepot,
              idVente: venteJeu.idVente,
              jeuNom: jeuDepot.nomJeu,
              editeurNom: jeuDepot.editeurJeu,
              prixJeu: jeuDepot.prixJeu,
              quantiteVendus: venteJeu.quantiteVendus,

            });
            this.jeuxVenduDataSource = new MatTableDataSource(this.jeuxVendu);
            this.jeuxVenduDataSource.sort = this.jeuxVenduSort;
            this.jeuxVenduDataSource.paginator = this.jeuxVenduPaginator;
          });
      });
    });
  }
}
