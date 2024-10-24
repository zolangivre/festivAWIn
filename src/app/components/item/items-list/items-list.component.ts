import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { JeuDepot } from '../../../models/item';
import { RouterLink } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatCardModule,
    MatFormField,
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    MatLabel
  ],
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  items: (JeuDepot & { cols: number; rows: number })[] = [];
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  statusFilter: string = '';

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getItems().subscribe((data) => {
      this.items = data;
    });
  }

  filteredItems() {
    return this.items.filter(item => {
      const matchesName = item.nomJeu.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesMinPrice = this.minPrice !== null ? item.prixJeu >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? item.prixJeu <= this.maxPrice : true;
      const matchesStatus = this.statusFilter ? item.statutJeu === this.statusFilter : true;

      return matchesName && matchesMinPrice && matchesMaxPrice && matchesStatus;
    });
  }

}
