import { Component, OnInit, inject, AfterViewInit, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { UsersService } from '../../../services/users.service';
import { JeuDepot } from '../../../models/item';
import { CommonModule, NgForOf } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
} from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  imports: [
    NgForOf,
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardModule,
    MatFormField,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  styleUrls: ['./items-list.component.css'],
})
export class ItemsListComponent implements OnInit, AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  items: (JeuDepot & { rows: number })[] = [];
  filteredItems: (JeuDepot & { rows: number })[] = [];
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  showExtraFilters: boolean = false;
  availabilityFilter: string = 'all';
  viewList: boolean = false;

  dataSource: MatTableDataSource<JeuDepot> = new MatTableDataSource<JeuDepot>(
    []
  );

  displayedColumns: string[] = [
    'nomJeu',
    'editeurJeu',
    'prixJeu',
    'quantiteJeuDisponible',
    'quantiteJeuVendu',
    'statutJeu',
    'dateDepot',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private itemService: ItemService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  get view(): boolean {
    return this.viewList;
  }

  set view(value: boolean) {
    if (this.viewList !== value) {
      this.viewList = value;
      console.log('Vue changée :', value);
      this.updatePaginationAndSort();
    }
  }

  updatePaginationAndSort(): void {
    if (this.sort && this.paginator) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadItems(): void {
    this.itemService.getItemsPasSupprime().subscribe((data) => {
      this.usersService.getUsers().subscribe((users) => {
        users.forEach((user) => {
          data.forEach((item) => {
            if (item.vendeur === user._id) {
              item.nomVendeur = user.nom;
              item.prenomVendeur = user.prenom;
            }
          });
        });
      });
      this.items = data;
      this.filteredItems = data;
      this.dataSource.data = this.items;
      this.updatePaginationAndSort();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applySearchFilter(): void {
    this.loadFilteredItems();
  }

  applyExtraFilter(): void {
    this.loadFilteredItems();
  }

  toggleExtraFilters(): void {
    this.showExtraFilters = !this.showExtraFilters;
  }

  toggleViewList(): void {
    this.viewList = !this.viewList;
    this.cdr.detectChanges(); // Déclenche le cycle de détection des changements
    this.updatePaginationAndSort();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.maxPrice = null;
    this.minPrice = null;
    this.availabilityFilter = 'all';
    this.filteredItems = [...this.items];
  }

  private loadFilteredItems(): void {
    this.filteredItems = this.items.filter((item) => {
      // Filtrer les noms des jeuDepot
      const matchesSearch =
        !this.searchTerm ||
        item.nomJeu.toLowerCase().startsWith(this.searchTerm.toLowerCase());

      // Filtrer les jeuDepot en fontction de leur prix
      const matchesMinPrice =
        this.minPrice === null || item.prixJeu >= this.minPrice;
      const matchesMaxPrice =
        this.maxPrice === null || item.prixJeu <= this.maxPrice;

      // Filtrr les jeuDepot en fonction de leur disponibilité
      const matchesAvailability =
        this.availabilityFilter === 'all' ||
        (this.availabilityFilter === 'available' &&
          item.statutJeu === 'Disponible') ||
        (this.availabilityFilter === 'soldout' && item.statutJeu === 'Vendu');

      return (
        matchesSearch && matchesMinPrice && matchesMaxPrice && matchesAvailability
      );
    });
  }
}
