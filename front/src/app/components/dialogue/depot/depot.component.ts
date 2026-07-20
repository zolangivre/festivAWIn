import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-depot',
    imports: [MatDialogModule, MatButtonModule, CommonModule],
    templateUrl: './depot.component.html',
    styleUrl: './depot.component.css'
})
export class DepotComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sommeFraisDepot: number }
  ) {}
}
