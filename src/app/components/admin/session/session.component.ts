import { Component, inject, AfterViewInit, ViewChild, LOCALE_ID } from '@angular/core';

import { SessionService } from '../../../services/session.service';
import { Session } from '../../../models/session';

import { DeleteComponent } from '../../dialogue/delete/delete.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LiveAnnouncer } from '@angular/cdk/a11y';

import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'; // Importer la locale française

registerLocaleData(localeFr, 'fr'); 

@Component({
    selector: 'app-session',
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatInputModule,
        CommonModule,
        MatDialogModule,
        MatSnackBarModule,
    ],
    templateUrl: './session.component.html',
    styleUrl: './session.component.css',
    providers: [{ provide: LOCALE_ID, useValue: 'fr' }]
})
export class SessionComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  sessions: Session[] = [];
  dataSource: MatTableDataSource<Session> = new MatTableDataSource<Session>([]);
  displayedColumns: string[] = [
    'dateDebut',
    'dateFin',
    'fraisDepot',
    'commission',
    'statutSession',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private sessionService: SessionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
) {}

  ngOnInit(): void {
    this.sessionService.getAllSessions().subscribe(
      (sessions) => {
        this.sessions = sessions;
        this.dataSource.data = this.sessions;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error loading sessions:', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  deleteSession(session: Session) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { type: 'cette session' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (session._id !== undefined) {
          this.sessionService.deleteSession(session._id).subscribe(() => {
            this.sessions = this.sessions.filter((s) => s._id !== session._id);
            this.dataSource.data = this.sessions;
            this.snackBar.open(
              'Session supprimé avec succès',
              'Fermer',
              {
                duration: 3000,
              }
            );
          });
        } else {
          console.error("Impossible de supprimer l'utilisateur");
        }
      }
    });
  }

  toggleBilanGeneral(session: Session) {
    window.location.href = `/bilan/${session._id}`;
  }
}
