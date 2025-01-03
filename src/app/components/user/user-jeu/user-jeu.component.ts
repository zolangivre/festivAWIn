import {
  Component,
  inject,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Utilisateur } from '../../../models/user';
import { ItemService } from '../../../services/item.service';
import { UsersService } from '../../../services/users.service';
import { JeuDepot } from '../../../models/item';

import { ItemEditComponent } from '../../dialogue/item-edit/item-edit.component';
import { DeleteComponent } from '../../dialogue/delete/delete.component';
import { RestoreComponent } from '../../dialogue/restore/restore.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-user-jeu',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './user-jeu.component.html',
  styleUrl: './user-jeu.component.css',
})
export class UserJeuComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);
  utilisateur!: Utilisateur;
  jeux: JeuDepot[] = [];
  dataSource: MatTableDataSource<JeuDepot> = new MatTableDataSource<JeuDepot>(
    []
  );
  displayedColumns: string[] = [
    'nomJeu',
    'editeurJeu',
    'prixJeu',
    'quantiteJeuDisponible',
    'quantiteJeuVendu',
    'statutJeu',
    'dateDepot',
    'fraisDepot',
    'remiseDepot',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private itemService: ItemService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('idUtilisateur');
    if (userId) {
      this.usersService.getUser(userId).subscribe((user) => {
        this.utilisateur = user;
        this.itemService
          .getItemsByUser(this.utilisateur._id)
          .subscribe((data) => {
            this.jeux = data.map((jeu) => ({
              ...jeu,
              dateDepot: new Date(jeu.dateDepot),
            }));
            this.dataSource.data = this.jeux;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
      });
    } else {
      console.error('User ID is null');
    }
  }

  ngAfterViewInit() {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteJeu(jeu: JeuDepot) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: { type: 'ce jeu' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (jeu._id != null) {
          jeu.statutJeu = 'Supprimé';
          this.itemService.updateJeuDepot(jeu).subscribe(() => {
            this.snackBar.open('Jeu supprimé avec succès', 'Fermer', {
              duration: 3000,
            });
          });
        } else {
          console.error('Impossible de supprimer le jeu');
        }
      }
    });
  }

  restoreJeu(jeu: JeuDepot) {
    const dialogRef = this.dialog.open(RestoreComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (jeu._id != null) {
          if (jeu.quantiteJeuDisponible === 0) {
            jeu.statutJeu = 'Vendu';
          } else {
            jeu.statutJeu = 'Disponible';
          }
          this.itemService.updateJeuDepot(jeu).subscribe(() => {
            this.snackBar.open('Jeu restauré avec succès', 'Fermer', {
              duration: 3000,
            });
          });
        } else {
          console.error('Impossible de restaurer le jeu');
        }
      }
    });
  }

  editJeu(jeu: JeuDepot) {
    const dialogRef = this.dialog.open(ItemEditComponent, {
      data: { nomJeu: jeu.nomJeu, editeurJeu: jeu.editeurJeu },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        jeu.nomJeu = result.nomJeu;
        jeu.editeurJeu = result.editeurJeu;

        this.itemService.getJeuDepot(jeu._id).subscribe((edit_jeu) => {
          edit_jeu.nomJeu = jeu.nomJeu;
          edit_jeu.editeurJeu = jeu.editeurJeu;
          this.itemService.updateJeuDepot(edit_jeu).subscribe(() => {
            this.snackBar.open('Modifications effectué avec succès', 'Fermer', {
              duration: 3000,
            });
          });
        });
      }
    });
  }

  // goBack(): void {
  //   this.router.navigate(['/utilisateur'], {
  //     queryParams: { idUtilisateur: this.utilisateur._id },
  //   });
  // }
}
