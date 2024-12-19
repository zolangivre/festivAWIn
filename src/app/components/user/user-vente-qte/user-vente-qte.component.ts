import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JeuDepot } from '../../../models/item';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-vente-qte',
  standalone: true,
  imports: [MatFormField, MatLabel, CommonModule, FormsModule, MatButtonModule, MatInputModule],
  templateUrl: './user-vente-qte.component.html',
  styleUrls: ['./user-vente-qte.component.css'],
})
export class UserVenteQteComponent {
  @Input() game!: JeuDepot;
  @Output() onConfirm = new EventEmitter<{ game: JeuDepot; quantity: number }>();
  @Output() onCancel = new EventEmitter<void>();

  quantity: number = 1;

  confirmSelection(): void {
    if (this.quantity > 0 && this.quantity <= this.game.quantiteJeu) {
      this.onConfirm.emit({ game: this.game, quantity: this.quantity });
    }
  }

  cancelSelection(): void {
    this.onCancel.emit();
  }
}
