import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BilanService } from '../../services/bilan.service';
import { Utilisateur } from '../../models/user';
import { Bilan } from '../../models/bilan';

@Component({
  selector: 'app-bilan',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './bilan.component.html',
  styleUrl: './bilan.component.css',
})
export class BilanComponent implements OnChanges {
  @Input() utilisateur!: Utilisateur;
  bilan: Bilan = new Bilan('', 0, 0, 0, 0, '');
  constructor(
    private bilanService: BilanService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['utilisateur'] && this.utilisateur) {
      this.updateBilan();
    }
  }

  updateBilan(): void {
    this.bilanService.getBilanById(this.utilisateur._id).subscribe((bilan) => {
      this.bilan = bilan;
    });
  }
}
