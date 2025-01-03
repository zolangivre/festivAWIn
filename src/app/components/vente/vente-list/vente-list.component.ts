import {
  Component,
  inject,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Vente } from '../../../models/vente';
import { JeuDepot } from '../../../models/item';
import { VenteJeu } from '../../../models/vente-jeu';

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

@Component({
    selector: 'app-vente-list',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatButtonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatInputModule,
    ],
    templateUrl: './vente-list.component.html',
    styleUrl: './vente-list.component.css',
})
export class VenteListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  ventes: Vente[] = [];
  jeuxVendus: VenteJeu[] = [];
  dataSource: MatTableDataSource<Vente> = new MatTableDataSource<Vente>([]);
  jeuxVendusDataSource: MatTableDataSource<VenteJeu> =
    new MatTableDataSource<VenteJeu>([]);
  selectedRow: Vente | null = null;

  displayedColumns: string[] = [
    'acheteurNom',
    'vendeurNom',
    'commissionVente',
    'dateVente',
    'montantTotal',
  ];

  @ViewChild('ventesSort') ventesSort!: MatSort;
  @ViewChild('ventesPaginator') ventesPaginator!: MatPaginator;
  @ViewChild('jeuxSort') jeuxSort!: MatSort;
  @ViewChild('jeuxPaginator') jeuxPaginator!: MatPaginator;

  constructor(
    private venteService: VenteService,
    private venteJeuService: VenteJeuService,
    private itemService: ItemService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    this.venteService.getVentes().subscribe((ventes) => {
      this.ventes = ventes;
      this.ventes.forEach((vente) => {
        this.userService.getUserById(vente.acheteur).subscribe((acheteur) => {
          vente.acheteurNom = acheteur.nom + ' ' + acheteur.prenom;
        });
        this.userService.getUserById(vente.vendeur).subscribe((vendeur) => {
          vente.vendeurNom = vendeur.nom + ' ' + vendeur.prenom;
        });
      });
      this.dataSource = new MatTableDataSource<Vente>(this.ventes);
      this.dataSource.sort = this.ventesSort;
      this.dataSource.paginator = this.ventesPaginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.ventesSort;
    this.dataSource.paginator = this.ventesPaginator;
    this.jeuxVendusDataSource.sort = this.jeuxSort;
    this.jeuxVendusDataSource.paginator = this.jeuxPaginator;
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

  showJeux(vente: Vente): void {
    this.selectedRow = vente;
    this.venteJeuService.getJeuxByVenteId(vente._id).subscribe((venteJeux) => {
      this.jeuxVendus = [];
      venteJeux.forEach((venteJeu) => {
        this.itemService
          .getJeuDepot(venteJeu.idJeuDepot)
          .subscribe((jeuDepot) => {
            this.jeuxVendus.push({
              _id: venteJeu._id,
              idJeuDepot: venteJeu.idJeuDepot,
              idVente: venteJeu.idVente,
              jeuNom: jeuDepot.nomJeu,
              editeurNom: jeuDepot.editeurJeu,
              prixJeu: jeuDepot.prixJeu,
              quantiteVendus: venteJeu.quantiteVendus,
            });
            this.jeuxVendusDataSource = new MatTableDataSource(this.jeuxVendus);
            this.jeuxVendusDataSource.sort = this.jeuxSort;
            this.jeuxVendusDataSource.paginator = this.jeuxPaginator;
          });
      });
    });
  }
}
