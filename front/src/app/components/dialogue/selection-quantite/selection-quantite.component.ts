
import { MatDialogModule } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JeuDepot } from '../../../models/item';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selection-quantite',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './selection-quantite.component.html',
  styleUrl: './selection-quantite.component.css',
})
export class SelectionQuantiteComponent {
  quantity: number = 1;

  constructor(
    public dialogRef: MatDialogRef<SelectionQuantiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { game: JeuDepot }
  ) {}

  confirmSelection(): void {
    if (
      this.quantity > 0 &&
      this.quantity <= this.data.game.quantiteJeuDisponible
    ) {
      this.dialogRef.close({ game: this.data.game, quantity: this.quantity });
    }
  }

  cancelSelection(): void {
    this.dialogRef.close();
  }
}
