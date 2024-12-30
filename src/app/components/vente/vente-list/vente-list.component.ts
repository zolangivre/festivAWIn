import {
  Component,
  Input,
  inject,
  AfterViewInit,
  ViewChild,
  LOCALE_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Vente } from '../../../models/vente';
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

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'; // Importer la locale française
import { JeuDepot } from '../../../models/item';

registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-vente-list',
  standalone: true,
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
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
})
export class VenteListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  ventes: Vente[] = [];
  jeuxVendus: (JeuDepot & { quantite: number })[] = [];
  dataSource: MatTableDataSource<Vente> = new MatTableDataSource<Vente>([]);
  jeuxVendusDataSource: MatTableDataSource<JeuDepot & { quantite: number }> =
    new MatTableDataSource<JeuDepot & { quantite: number }>([]);
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

  goBack() {
    window.history.back();
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
              ...jeuDepot,
              quantite: venteJeu.quantiteVendus,
            });
            this.jeuxVendusDataSource = new MatTableDataSource(this.jeuxVendus);
            this.jeuxVendusDataSource.sort = this.jeuxSort;
            this.jeuxVendusDataSource.paginator = this.jeuxPaginator;
          });
      });
    });
  }
}
