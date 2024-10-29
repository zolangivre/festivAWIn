import { Component, Output, Input, OnChanges, SimpleChanges } from '@angular/core';

import { JeuDepot } from '../../../models/item';

import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-depot-list',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './depot-list.component.html',
  styleUrl: './depot-list.component.css',
})
export class DepotListComponent {
  @Input() depotList: JeuDepot[] = [];
  jeux = this.depotList;
  displayedColumns: string[] = [
    'nomJeu',
    'editeurJeu',
    'prixJeu',
    'quantiteJeu',
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['depotList']) {
      console.log('changes', changes);
      this.refreshTable();
    }
  }

  refreshTable() {
    this.jeux = this.depotList;
  }
  constructor() {}

  updateDepot(): void {
    console.log('updateDepot', this.depotList);
    this.jeux = this.depotList;
  }

  deleteDepot(): void {
    this.depotList.pop();
  }
}
