import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-vente',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './vente.component.html',
  styleUrl: './vente.component.css',
})
export class VenteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { montantTotal: number }
  ) {}
}
