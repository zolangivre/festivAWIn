import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { JeuDepot } from '../../../models/item';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardModule} from '@angular/material/card';

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
    MatCardModule
  ],
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  items: (JeuDepot & { cols: number; rows: number })[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.itemService.getItems().subscribe((data) => {
      this.items = data;
    });
  }
}
