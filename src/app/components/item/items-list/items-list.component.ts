import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { JeuDepot } from '../../../models/item';
import { RouterLink } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';

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
    MatInputModule,
    FormsModule,
    CommonModule,
    MatRadioModule,
    MatButton
  ],
  styleUrls: ['./items-list.component.css']
})

export class ItemsListComponent implements OnInit {
  items: (JeuDepot & { rows: number })[] = [];
  filteredItems: (JeuDepot & { rows: number })[] = [];
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  showExtraFilters: boolean = false;
  availabilityFilter: string = 'all';

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getItems().subscribe((data) => {
      this.items = data;
      this.filteredItems = data;
    });
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

  resetFilters(): void {
    this.searchTerm = '';
    this.maxPrice = null;
    this.minPrice = null;
    this.availabilityFilter = 'all';
    this.filteredItems = [...this.items];
  }

  private loadFilteredItems(): void {
    this.itemService.getFilteredItems(this.searchTerm, this.minPrice, this.maxPrice, this.availabilityFilter)
      .subscribe(filteredItems => this.filteredItems = filteredItems);
  }
}