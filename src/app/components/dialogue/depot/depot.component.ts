import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-depot',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './depot.component.html',
  styleUrl: './depot.component.css',
})
export class DepotComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sommeFraisDepot: number }
  ) {}
}
