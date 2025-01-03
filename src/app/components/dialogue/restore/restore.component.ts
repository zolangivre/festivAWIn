import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-restore',
  imports: [
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './restore.component.html',
  styleUrl: './restore.component.css',
})
export class RestoreComponent {
  constructor(
    public dialogRef: MatDialogRef<RestoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) {}
}
