import {
  Component,
  inject,
  AfterViewInit,
  ViewChild,
  LOCALE_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Vente } from '../../../models/vente';
import { Utilisateur } from '../../../models/user';
import { VenteService } from '../../../services/vente.service';
import { UsersService } from '../../../services/users.service';
import { VenteJeuService } from '../../../services/vente-jeu.service';
import { ItemService } from '../../../services/item.service';
import { FactureService } from '../../../services/facture.service';

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
  selector: 'app-user-achat-list',
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
  templateUrl: './user-achat-list.component.html',
  styleUrl: './user-achat-list.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
})
export class UserAchatListComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  utilisateur!: Utilisateur;
  achats: Vente[] = [];
  jeuxAcheter: (JeuDepot & { quantite: number })[] = [];
  dataSource: MatTableDataSource<Vente> = new MatTableDataSource<Vente>([]);
  jeuxAcheterDataSource: MatTableDataSource<JeuDepot & { quantite: number }> =
    new MatTableDataSource<JeuDepot & { quantite: number }>([]);
  selectedRow: Vente | null = null;
  displayedColumns: string[] = ['vendeurNom', 'dateVente', 'montantTotal'];

  @ViewChild('achatsSort') achatsSort!: MatSort;
  @ViewChild('achatsPaginator') achatsPaginator!: MatPaginator;
  @ViewChild('jeuxAcheterSort') jeuxAcheterSort!: MatSort;
  @ViewChild('jeuxAcheterPaginator') jeuxAcheterPaginator!: MatPaginator;

  constructor(
    private venteService: VenteService,
    private usersService: UsersService,
    private venteJeuService: VenteJeuService,
    private itemService: ItemService,
    private factureService: FactureService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('idUtilisateur');
    if (userId) {
      this.usersService.getUser(userId).subscribe((user) => {
        this.utilisateur = user;
        this.venteService.getVentesByAcheteurId(userId).subscribe((achats) => {
          this.achats = achats;
          this.achats.forEach((achat) => {
            this.usersService
              .getUserById(achat.acheteur)
              .subscribe((acheteur) => {
                achat.acheteurNom = acheteur.nom + ' ' + acheteur.prenom;
              });
            this.usersService
              .getUserById(achat.vendeur)
              .subscribe((vendeur) => {
                achat.vendeurNom = vendeur.nom + ' ' + vendeur.prenom;
              });
          });
          this.dataSource = new MatTableDataSource<Vente>(this.achats);
          this.dataSource.sort = this.achatsSort;
          this.dataSource.paginator = this.achatsPaginator;
        });
      });
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.achatsSort;
    this.dataSource.paginator = this.achatsPaginator;
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

  showJeuxAcheter(vente: Vente): void {
    this.selectedRow = vente;
    this.venteJeuService.getJeuxByVenteId(vente._id).subscribe((achatJeux) => {
      this.jeuxAcheter = [];
      achatJeux.forEach((achatJeu) => {
        this.itemService
          .getJeuDepot(achatJeu.idJeuDepot)
          .subscribe((jeuDepot) => {
            this.jeuxAcheter.push({
              ...jeuDepot,
              quantite: achatJeu.quantiteVendus,
            });
            this.jeuxAcheterDataSource = new MatTableDataSource(
              this.jeuxAcheter
            );
            this.jeuxAcheterDataSource.sort = this.jeuxAcheterSort;
            this.jeuxAcheterDataSource.paginator = this.jeuxAcheterPaginator;
          });
      });
    });
  }

  telechargerFacture(vente: Vente): void {
    this.factureService.telechargerFacture(vente._id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture_${vente._id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
