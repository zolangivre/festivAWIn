import { Component, inject, AfterViewInit, ViewChild } from '@angular/core';

import { SessionService } from '../../../services/session.service';
import { Session } from '../../../models/session';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

import { LiveAnnouncer } from '@angular/cdk/a11y';

import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr'; // Importer la locale française

registerLocaleData(localeFr, 'fr'); 

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css',
})
export class SessionComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  sessions: Session[] = [];
  dataSource: MatTableDataSource<Session> = new MatTableDataSource<Session>([]);
  displayedColumns: string[] = [
    'dateDebut',
    'dateFin',
    'fraisDepot',
    'statutSession',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getAllSessions().subscribe(
      (sessions) => {
        this.sessions = sessions;
        this.dataSource.data = this.sessions;
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

  goBack(): void {
    window.history.back();
  }

  deleteSession(session: Session) {
    if (session._id !== undefined) {
      this.sessionService.deleteSession(session._id).subscribe(() => {
        this.sessions = this.sessions.filter((s) => s._id !== session._id);
        this.dataSource.data = this.sessions;
      });
    }
  }
}
