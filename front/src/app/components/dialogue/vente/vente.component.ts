import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-vente',
    imports: [
        MatDialogModule,
      MatButtonModule,
      CommonModule
    ],
    templateUrl: './vente.component.html',
    styleUrl: './vente.component.css'
})
export class VenteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { montantTotal: number }
  ) {}
}
